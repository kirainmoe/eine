import cluster from "cluster";
import { spawn } from "child_process";
import { accessSync, existsSync, lstatSync, mkdirSync } from "fs";
import { R_OK, W_OK } from "constants";

import chalk from "chalk";
import axios from "axios";
import bind from 'bind-decorator';
import { v4 as uuidv4 } from "uuid";

/* Eine: typescript types */
import {
  AdapterDriverInterface,
  ClusterRole,
  EineEventName,
  EineEventTypeStr,
  EineOption,
  EventCallback,
  EventFilter,
  EventGenerator,
  EventHandler,
  EventHandleResult,
  EventIterator,
  InterruptHandler,
  messageEventType,
  MessageEventType,
  MessagePullingMode,
  MessageTypeStr,
  SenderType,
} from "./common/types";
import { MessageChain } from "./common/types/MessageComponentType";
import { botEventType, EventTypeStr } from "./common/types/EventType";

/* Eine: constant & preset values */
import {EINE, EINE_DEFAULT_OPTIONS, EINE_VERSION} from "./common/constant";
import { GroupTarget, Myself } from "./common/sendTarget";

/* Eine: libraries */
import EineLogger from "./libs/logger";
import EinePainter from "./libs/painter";
import EineDB from "./libs/db";
import EineScheduler from "./libs/scheduler";

/* Eine: Adapter drivers */
import HttpDriver, {HttpDriverOptions} from "./drivers/http";
import WebsocketDriver, { WebsocketDriverOptions } from "./drivers/ws";

/* Eine: Admin Panel server */
import EineServer from "./server";

/* Eine: small tools */
import serializeMessage from "./utils/serializeMessage";
import injectExtraProperty from "./utils/injectExtraProperty";

/**
 * @package @eine-nineteen/eine
 * @module Eine
 * @author Yume<kirainmoe@gmail.com>
 * @licence MIT
 */
export class Eine {
  /** Eine Framework 实例化选项 */
  private eineOptions: EineOption = EINE_DEFAULT_OPTIONS;

  /** Driver 实例集合 */
  public adapters: AdapterDriverInterface = {};

  /** 当前进程角色 */
  private _clusterRole: ClusterRole;
  public get clusterRole() { return this._clusterRole; }

  constructor(options: Partial<EineOption> = {}) {
    this.eineOptions = {
      ...this.eineOptions,
      ...options,
    };
    this._logger = new EineLogger(this.eineOptions.logLevel, this.eineOptions.botName);
    this._painter = new EinePainter(this);
    this._scheduler = new EineScheduler(this);
    this.eventHandler = new Map();
    this.interruptQueue = new Map();
    
    this._clusterRole = this.eineOptions.enableConcurrent
      ? cluster.isWorker
        ? ClusterRole.SECONDARY
        : ClusterRole.PRIMARY
      : ClusterRole.PRIMARY;

    if (this.clusterRole === ClusterRole.PRIMARY) {
      this.logger.info("Launching {}...",  chalk.cyan(this.eineOptions.botName));
    } else {
      this.logger.info("Concurrent Mode: secondary node {} launched.", process.env.EINE_PROCESS_INDEX);
      // 并发进程不支持 Websocket 模式
      this.eineOptions.messagePullingMode = MessagePullingMode.POLLING;
      this.eineOptions.messageBatchCount = 1;
    }
  }

  /** 初始化 */
  @bind
  public async init() {
    if (this.clusterRole === ClusterRole.PRIMARY) {
      this.logger.info("Initializing framework features.");
      this.checkAppWorkspace();
    }

    this.bindInternalEvents();

    if (this.eineOptions.enableDatabase) {
      this._db = new EineDB(this.eineOptions.mongoConfig, this);
      await this.db?.connect();
    }

    if (this.clusterRole === ClusterRole.PRIMARY) {
      if (this.eineOptions.enableServer) {
        if (!this.eineOptions.enableDatabase) {
          this.logger.warn("EineServer: panel requires database. please check `enableDatabase` option.");
        } else {
          this._server = new EineServer(this);
          await this.server?.startServer();
        }
      }

      this.logger.info(
        "{} {} {}",
        chalk.green("Initialization completed, bot"),
        chalk.cyan(this.eineOptions.botName),
        chalk.green("is ready.")
      );
      this.logger.info("🎩 {} (v{})", chalk.red(`Powered by ${EINE} Framework`), EINE_VERSION);  
    }
  }

  /** 绑定内部事件 */
  private bindInternalEvents() {
    this.logger.verbose("register interal events: ");

    this.on('AfterVerify')(this.afterVerify.bind(this));
    this.on('AfterBind')(this.afterBind.bind(this));
    this.on('SendMessage')(this.afterSendMessage.bind(this));
  }

  /** 检查工作空间是否存在 */
  public checkAppWorkspace() {
    this.logger.verbose("checking workspace {} is available.", this.eineOptions.appDirectory);
    if (existsSync(this.eineOptions.appDirectory)) {
      // 存在同名文件
      if (!lstatSync(this.eineOptions.appDirectory).isDirectory) {
        this.logger.error("Cannot use {} as workspace: file exists", this.eineOptions.appDirectory);
        process.exit(1);
      }
      // 对文件夹没有读写访问权限
      try {
        accessSync(this.eineOptions.appDirectory, R_OK | W_OK);
      } catch (err) {
        this.logger.error(
          "Cannot use {} as workspace: permission for read/write denied.",
          this.eineOptions.appDirectory
        );
      }
      return true;
    } else {
      // 不存在文件夹则执行创建逻辑
      try {
        mkdirSync(this.eineOptions.appDirectory);
      } catch (err) {
        this.logger.error("Creating workspace {} failed, {}", this.eineOptions.appDirectory, err);
      }
    }
  }

  /**
   * 根据关键字获取 EineOptions 的值
   * @param key 关键字
   * @returns any
   */
  @bind
  public getOption(key: keyof EineOption) {
    return this.eineOptions[key];
  }

  /**
   * 获取 Eine 版本号
   * @returns number
   */
  @bind
  public getVersion() {
    return EINE_VERSION;
  }

  /* ------------------------ 生命周期 ------------------------ */
  /** 重启 BOT */
  @bind
  public async relaunch() {
    if (this.clusterRole !== ClusterRole.PRIMARY) {
      process.send?.("EINE_COMMAND_RELAUNCH");
      return;
    }

    this.logger.info("received `relaunch` command, {} will be relaunched in 3 secs.", this.eineOptions.botName);
    setTimeout(() => {
      const child = spawn(process.argv[0], process.argv.slice(1), {
        detached: true,
        stdio: "inherit",
      });
      child.unref();

      this.logger.success("relaunched {}, parent process is exiting.", this.eineOptions.botName);
      process.exit(0);
    }, 3000);
  }

  /**
   * 停止 BOT
   * @param exitCode 返回码
   */
  @bind
  public async shutdown(exitCode: number = 0) {
    if (this.clusterRole !== ClusterRole.PRIMARY) {
      process.send?.("EINE_COMMAND_SHUTDOWN");
      return;
    }

    this.logger.info("received `shutdown` command, {} will be shutdown in 3 secs.", this.eineOptions.botName);
    setTimeout(() => process.exit(exitCode), 3000);
  }

  /* ------------------------ 认证系统 ------------------------ */
  /**
   * 与 mirai-api-http 进行身份验证
   * @returns Promise<any>
   */
  @bind
  public async verify() {
    const { adapters } = this.eineOptions;
    const verifyPromises = [];

    if (this.clusterRole === ClusterRole.PRIMARY) {
      this.logger.info("Begin verify()");
      this.logger.verbose("Run: beforeVerify hooks.");
      this.dispatch(EineEventTypeStr.BEFORE_VERIFY, null);
    }

    if (!adapters.http && !adapters.ws) {
      this.logger.error("Verify failed: no available adapter is found.");
      this.logger.tips("Supported adapters are: 'http', 'ws'.");
      this.logger.tips("Check the constructor options `{}` in your Eine App.", "adapters");
      return Promise.reject(false);
    }

    if (adapters.http) {
      this.adapters.http = new HttpDriver(
        {
          ...adapters.http,
          ...this.eineOptions,
        } as HttpDriverOptions,
        this
      );

      verifyPromises.push(
        this.adapters.http
          .verify(this.clusterRole === ClusterRole.PRIMARY ? undefined : process.env.EINE_HTTP_SESSION)
          .catch((err) => {
            this.logger.error("HTTP adapter verify failed.");
            delete this.adapters.http;
          })
      );
    }

    // 只有主进程才建立 websocket 连接
    if (adapters.ws && this.clusterRole === ClusterRole.PRIMARY) {
      this.adapters.ws = new WebsocketDriver(
        {
          ...adapters.ws,
          ...this.eineOptions,
        } as WebsocketDriverOptions,
        this
      );

      verifyPromises.push(
        this.adapters.ws.verify().catch((err) => {
          this.logger.error("Websocket adapter verify failed.");
          delete this.adapters.ws;
        })
      );
    }

    return Promise.all(verifyPromises).then((result) => {
      if (this.clusterRole === ClusterRole.PRIMARY) {
        this.logger.success("End verify(): All adapters are verified.");
        this.dispatch(EineEventTypeStr.AFTER_VERIFY);
      }
      return result;
    });
  }

  /**
   * 与 mirai-api-http 进行会话绑定 (仅 HttpAdapter)
   * @return Promise<any>
   */
  @bind
  public async bind() {
    if (this.clusterRole !== ClusterRole.PRIMARY) {
      if (this.eineOptions.messagePullingMode === MessagePullingMode.POLLING) {
        this.adapters.http!.startPollingMessage(this.eineOptions.pollInterval);
      }
      return;
    }

    if (!this.adapters.http) {
      this.logger.warn("No HTTP Adapter is configured. Skipping bind().");
      return;
    }

    this.logger.info("Begin bind()");
    this.logger.verbose("Run: beforeBind hooks.");
    this.dispatch(EineEventTypeStr.BEFORE_BIND, null);
    this.logger.verbose("beforeBind OK");

    return this.adapters.http.bind().then((result) => {
      this.logger.success("End bind(): bind successfully.");
      this.dispatch(EineEventTypeStr.AFTER_BIND, null);
      return result;
    }).catch(err => {
      this.logger.error("HTTP adapter bind failed.");
    });
  }
  /* ------------------------ 日志系统 ------------------------ */
  /** Eine Logger 日志处理器 (readonly) */
  public get logger() {
    return this._logger;
  }
  private readonly _logger: EineLogger;

  /**
   * 打印接收到的消息到 Log
   * @param sender
   * @param messageString
   */
  private logMessage(sender: any, messageString: string) {
    let senderString;
    if (sender.nickname) {
      senderString = sender.nickname;
    } else if (sender.memberName) {
      senderString = sender.memberName + " -> " + sender.group.name;
    } else {
      senderString = sender.id;
    }

    if (this.eineOptions.enableMessageLog) {
      this.logger.message(senderString, messageString);
    }
  }

  /* ------------------------ 事件系统 ------------------------ */
  /** Eine Event 事件系统 */
  private eventHandler: Map<EventTypeStr | string, EventHandler[]>;

  /** 中断响应队列 */
  private interruptQueue: Map<string, InterruptHandler[]>;

  /** 是否正在处理中断，避免清理中断时覆盖 */
  private isResolvingInterrupt: boolean = false;

  /**
   * 监听事件
   * Usage: eine.on(eventName1, [eventName2, ..., filter])(callback)
   * @returns (callback: EventCallback) => void
   * @param args (EineEventName | EventFilter)[]
   */
  public on(...args: (EineEventName | EventFilter)[]) {
    const registerEvent = (
      event: EineEventName,
      callback: EventCallback | EventGenerator,
      filters: EventFilter[]
    ) => {
      const cb = callback as EventCallback;
      this.logger.verbose(
        "registered event handler: {} -> {}.",
        event,
        cb.name.length ? cb.name : "(anonymous function)"
      );

      if (this.eventHandler.has(event)) {
        this.eventHandler.get(event)?.push({ filters, callback: cb });
      } else {
        this.eventHandler.set(event, [{ filters, callback: cb }]);
      }
    };

    return (callback: EventCallback | EventGenerator) => {
      const eventNames: Set<EineEventName> = new Set();
      let filters: EventFilter[] = [];

      args.forEach((arg) => {
        if (typeof arg === "string") {
          // 接受所有类型的消息
          if (arg === EineEventTypeStr.MESSAGE) {
            messageEventType.forEach((event) => eventNames.add(event));
            return;
          }
          eventNames.add(arg);
        } else if (typeof arg === "function") {
          filters.push(arg);
        }
      });

      eventNames.forEach((eventName) => registerEvent(eventName, callback, filters));
    };
  }

  /**
   * 中断处理函数，等待条件满足时唤醒继续执行
   * @param sender 等待信息发送者
   * @param type 等待信息类型
   * @param iterator 处理函数的 generator iterator
   * @param filter 条件函数
   * @param lifetime 中断等待最长时间，默认为 1 小时
   */
  @bind
  public wait(
    sender: SenderType,
    type: MessageTypeStr,
    iterator: EventIterator,
    filter: EventFilter,
    lifetime: number = 3600_000
  ) {
    const group = (sender as any).group;
    const key = JSON.stringify({
      id: sender.id,
      group: group ? group.id : undefined,
      type,
    });
    const triggerTime = +new Date();
    const interruptId = uuidv4();
    const interruptItem = { interruptId, filter, iterator, triggerTime, lifetime };
    if (this.interruptQueue.has(key)) {
      this.interruptQueue.get(key)?.push(interruptItem);
    } else {
      this.interruptQueue.set(key, [interruptItem]);
    }
    
    // 定时取消
    setTimeout(() => this.cancelWait(key, interruptId), lifetime);

    return {
      key,
      interruptId,
    };
  }

  /**
   * 取消中断
   * @param key 中断 key
   * @param interruptId 事件处理器 ID
   */
  @bind
  public cancelWait(key: string, interruptId: string) {
    const queue = this.interruptQueue.get(key);
    if (queue) {
      this.interruptQueue.set(key, queue.filter(item => item.interruptId !== interruptId));
    }
  }

  /**
   * 触发一个事件
   * @param event 事件名称
   * @param payload 事件附带内容
   */
  @bind
  public async dispatch(event: EineEventName, payload: any = null) {
    const handlers = this.eventHandler.get(event); // 获取 EventHandler
    let extraParams: any = injectExtraProperty(event, payload, this); // 注入多余参数

    // 事件为好友消息、群消息、临时消息或陌生人消息，注入参数和回复方法并记录
    // 如果有关于该消息来源的中断请求，优先响应该中断
    if (messageEventType.includes(event as MessageTypeStr)) {
      if (this.clusterRole === ClusterRole.PRIMARY) {
        // logMessage 的优先级应当高于 interrupt，因此不使用监听，在此显式调用
        this.logMessage(payload.sender, extraParams.messageStr);

        // 管理面板 pushMessage
        if (this.eineOptions.enableServer) {
          this.server?.pushMessage({
            type: event as MessageTypeStr,
            sender: payload.sender,
            messageChain: payload.messageChain,
            str: extraParams.messageStr,
          });
        }

        // 保存信息到数据库
        if (this.eineOptions.enableDatabase && this.db!.isConnected) {
          this.db!.saveIncomingMessage(
            event as MessageTypeStr,
            payload.sender,
            event === MessageTypeStr.GROUP_MESSAGE ? GroupTarget(payload.sender.group.id) : Myself(),
            payload.messageChain
          );
        }
      }

      // 响应中断
      const group = (payload.sender as any).group;
      const interruptKey = JSON.stringify({
        id: payload.sender.id,
        group: group ? group.id : undefined,
        type: payload.type,
      });
      const interrupts = this.interruptQueue.get(interruptKey); // 根据消息来源作为 key 获取中断向量
      const reservedInterrupts = []; // eine.wait() 产生的中断有效期只有一次，当响应后会被移除
      const currentTime = +new Date();
      if (interrupts) {
        this.isResolvingInterrupt = true;
        let handleResult = EventHandleResult.CONTINUE;
        for (let i = 0; i < interrupts.length; i++) {
          const interrupt = interrupts[i];
          // 中断已经过期，不再响应
          if (interrupt.triggerTime + interrupt.lifetime < currentTime) {
            continue;
          }
          const filterResult = await interrupt.filter(payload, extraParams.messageStr);
          if (!filterResult || handleResult === EventHandleResult.DONE) {
            reservedInterrupts.push(interrupt);
            continue;
          }
          handleResult = interrupt.iterator.next({
            eine: this,
            iterator: interrupt.iterator,
            ...payload,
            ...extraParams,
          }).value;
        }
        this.interruptQueue.set(interruptKey, reservedInterrupts);
        this.isResolvingInterrupt = false;
        if (handleResult === EventHandleResult.DONE) {
          return;
        }
      } // if (interrupts)
    }

    // 处理事件回调
    if (handlers) {
      for (const handler of handlers) {
        if (handler.filters) {
          let filterResult = true;
          for (const filter of handler.filters) {
            filterResult = filterResult && (await filter(payload, extraParams.messageStr));
            if (!filterResult)
              break;
          }
          if (!filterResult) continue;
        }

        // generator function: 中断类型的生成器函数只在主进程处理
        if (Object.prototype.toString.call(handler.callback) === "[object GeneratorFunction]") {
          if (this.clusterRole !== ClusterRole.PRIMARY) {
            continue;
          }

          const iterator = (handler.callback as EventGenerator)();
          iterator.next();

          const handleResult = iterator.next({
            eine: this,
            iterator,
            ...payload,
            ...extraParams,
          }).value;

          if (handleResult === EventHandleResult.DONE) break;
        }
        // normal callback: 主进程不处理消息和 BOT 事件
        else {
          if (
            this.eineOptions.enableConcurrent &&
            this.clusterRole === ClusterRole.PRIMARY &&
            (messageEventType.includes(event as MessageTypeStr) || botEventType.includes(event as EventTypeStr))
          )
            continue;
          const cb = handler.callback as EventCallback;
          const handleResult: EventHandleResult | void = await cb({
            eine: this,
            ...payload,
            ...extraParams,
          });

          if (handleResult === EventHandleResult.DONE) {
            return;
          }
        } // if (check generator function)
      } // foreach handlers
    } // if handlers
  }

  /**
   * 处理消息和事件
   * @param message 消息 & 事件
   */
  @bind
  public resolveMessageAndEvent(message: MessageEventType | MessageEventType[]) {
    if (message instanceof Array) {
      message.map((msg) => this.dispatch(msg.type, msg));
    } else {
      this.dispatch(message.type, message);
    }
  }

  /* ------------------------ 绘图系统 ------------------------ */
  /** Eine Painter 实例 */
  public get painter() {
    return this._painter;
  }
  public get importFont() {
    return EinePainter.importFont;
  }
  private readonly _painter: EinePainter;

  /* ------------------------ 事件钩子 ------------------------ */
  /** afterVerify Hook */
  private afterVerify() {
    this.logger.verbose("Run: afterVerify hooks.");

    // 检查消息获取模式
    if (this.eineOptions.messagePullingMode === MessagePullingMode.PASSIVE_WS) {
      if (!this.adapters.ws) {
        this.logger.warn("WebSocket adapter is not found or verified failed.");
        this.logger.warn("messagePullingMode will be switched from `PASSIVE_WS` to `POLLING`.");

        this.eineOptions.messagePullingMode = MessagePullingMode.POLLING;
      }
    }
  }

  /** bound Hook */
  private afterBind() {
    this.logger.verbose("Run: afterBind hooks.");

    for (let i = 0; this.eineOptions.enableConcurrent && i < this.eineOptions.maxConcurrentNumber; i++) {
      cluster.fork({
        EINE_PROCESS_INDEX: i, 
        EINE_PROCESS_SECONDARY: true,
        EINE_HTTP_SESSION: this.adapters.http?.session,
      });

      cluster.on("message", (message) =>
        this.dispatch(EineEventTypeStr.PROCESS_MESSAGE, {
          message,
        })
      );
    }

    if (this.eineOptions.messagePullingMode === MessagePullingMode.POLLING) {
      this.adapters.http!.startPollingMessage(this.eineOptions.pollInterval);
    }
  }

  /** after send message Hook */
  private afterSendMessage({ target, type, messageChain }: {
    target: any,
    type: MessageTypeStr,
    messageChain: MessageChain,
  }) {
    let senderString: string = '';

    switch (type) {
      case MessageTypeStr.FRIEND_MESSAGE:
        senderString = `${this.eineOptions.botName} -> [Friend: ${target.id}]`;
        break;

      case MessageTypeStr.GROUP_MESSAGE:
        senderString = `${this.eineOptions.botName} -> [Group: ${target.group.id}]`;
        break;
      
      case MessageTypeStr.TEMP_MESSAGE:
        senderString = `${this.eineOptions.botName} -> [Temp: ${target.id}]`;
        break;
    }
    const messageString = serializeMessage(messageChain);
    
    if (this.eineOptions.enableMessageLog) {
      this.logger.message(senderString, messageString);
    }

    if (this.eineOptions.enableDatabase && this.db!.isConnected) {
      this.db!.saveOutgoingMessage(type, Myself(), target, messageChain);
    }
  }

  private recevingProcessMessage({ message }: {
    message: string
  }) {
    console.log("Receving ", message);
    if (message === "EINE_COMMAND_RELAUNCH") {
      return this.relaunch();
    }
    if (message === "EINE_COMMAND_SHUTDOWN") {
      return this.shutdown();
    }
  }

  /* ------------------------ 文档数据库 ------------------------ */
  /** EineDB - MongoDB 封装 */
  public get db() { return this._db; }
  private _db: EineDB | null = null;

  /* ------------------------ 适配器驱动 ------------------------ */
  /**
   * 选择最适合的 Adapter Driver
   * @param property
   */
  @bind
  public pickBest(property?: string): any {
    if (!property && this.adapters.ws)
      return this.adapters.ws;
    if (property && this.adapters.ws?.hasOwnProperty(property))
      return this.adapters.ws;
      
    return this.adapters.http!;
  }

  /** 获取 HTTP Adapter 实例 */
  public get http() { return this.adapters.http; }

  /** 获取 Websocket Adapter 实例 */
  public get ws() { return this.adapters.ws; }

  /* ------------------------ AdminPanel 服务器 ------------------------ */
  /** EineServer 管理面板服务器 */
  public get server() { return this._server; }
  private _server: EineServer | null = null;

  /** ------------------------ 调度任务系统 ------------------------ */
  /** EineScheduler 计划任务调度器 */
  public get scheduler() { return this._scheduler; }
  private _scheduler: EineScheduler | null = null;

  /* 静态类型定义 */
  static Logger = EineLogger;
  static Painter = EinePainter;
  static DB = EineDB;
  static Axios = axios;
}

export * from "./common";
export * as Utils from "./utils";
export * as Filters from "./utils/internalFilter";

export default Eine;
