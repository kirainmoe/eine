import { AdapterDriverInterface, ClusterRole, EineEventName, EineOption, EventCallback, EventFilter, EventGenerator, EventIterator, MessageEventType, MessageTypeStr, SenderType } from "./common/types";
import EineLogger from "./libs/logger";
import EinePainter from "./libs/painter";
import EineDB from "./libs/db";
import EineScheduler from "./libs/scheduler";
import HttpDriver from "./drivers/http";
import WebsocketDriver from "./drivers/ws";
import EineServer from "./server";
/**
 * @package @eine-nineteen/eine
 * @module Eine
 * @author Yume<kirainmoe@gmail.com>
 * @licence MIT
 */
export declare class Eine {
    /** Eine Framework 实例化选项 */
    private eineOptions;
    /** Driver 实例集合 */
    adapters: AdapterDriverInterface;
    /** 当前进程角色 */
    private _clusterRole;
    get clusterRole(): ClusterRole;
    constructor(options?: Partial<EineOption>);
    /** 初始化 */
    init(): Promise<void>;
    /** 绑定内部事件 */
    private bindInternalEvents;
    /** 检查工作空间是否存在 */
    checkAppWorkspace(): true | undefined;
    /**
     * 根据关键字获取 EineOptions 的值
     * @param key 关键字
     * @returns any
     */
    getOption(key: keyof EineOption): string | number | boolean | import("./common/types").AdapterSetting | Partial<import("./libs/db").MongoConfig> | import("./common/types").EineServerOptions;
    /**
     * 获取 Eine 版本号
     * @returns number
     */
    getVersion(): string;
    /** 重启 BOT */
    relaunch(): Promise<void>;
    /**
     * 停止 BOT
     * @param exitCode 返回码
     */
    shutdown(exitCode?: number): Promise<void>;
    /**
     * 与 mirai-api-http 进行身份验证
     * @returns Promise<any>
     */
    verify(): Promise<unknown[]>;
    /**
     * 与 mirai-api-http 进行会话绑定 (仅 HttpAdapter)
     * @return Promise<any>
     */
    bind(): Promise<boolean | void>;
    /** Eine Logger 日志处理器 (readonly) */
    get logger(): EineLogger;
    private readonly _logger;
    /**
     * 打印接收到的消息到 Log
     * @param sender
     * @param messageString
     */
    private logMessage;
    /** Eine Event 事件系统 */
    private eventHandler;
    /** 中断响应队列 */
    private interruptQueue;
    /** 是否正在处理中断，避免清理中断时覆盖 */
    private isResolvingInterrupt;
    /**
     * 监听事件
     * Usage: eine.on(eventName1, [eventName2, ..., filter])(callback)
     * @returns (callback: EventCallback) => void
     * @param args (EineEventName | EventFilter)[]
     */
    on(...args: (EineEventName | EventFilter)[]): (callback: EventCallback | EventGenerator) => void;
    /**
     * 中断处理函数，等待条件满足时唤醒继续执行
     * @param sender 等待信息发送者
     * @param type 等待信息类型
     * @param iterator 处理函数的 generator iterator
     * @param filter 条件函数
     * @param lifetime 中断等待最长时间，默认为 1 小时
     */
    wait(sender: SenderType, type: MessageTypeStr, iterator: EventIterator, filter: EventFilter, lifetime?: number): {
        key: string;
        interruptId: string;
    };
    /**
     * 取消中断
     * @param key 中断 key
     * @param interruptId 事件处理器 ID
     */
    cancelWait(key: string, interruptId: string): void;
    /**
     * 触发一个事件
     * @param event 事件名称
     * @param payload 事件附带内容
     */
    dispatch(event: EineEventName, payload?: any): Promise<void>;
    /**
     * 处理消息和事件
     * @param message 消息 & 事件
     */
    resolveMessageAndEvent(message: MessageEventType | MessageEventType[]): void;
    /** Eine Painter 实例 */
    get painter(): EinePainter;
    get importFont(): typeof EinePainter.importFont;
    private readonly _painter;
    /** afterVerify Hook */
    private afterVerify;
    /** bound Hook */
    private afterBind;
    /** after send message Hook */
    private afterSendMessage;
    private recevingProcessMessage;
    /** EineDB - MongoDB 封装 */
    get db(): EineDB | null;
    private _db;
    /**
     * 选择最适合的 Adapter Driver
     * @param property
     */
    pickBest(property?: string): any;
    /** 获取 HTTP Adapter 实例 */
    get http(): HttpDriver | undefined;
    /** 获取 Websocket Adapter 实例 */
    get ws(): WebsocketDriver | undefined;
    /** EineServer 管理面板服务器 */
    get server(): EineServer | null;
    private _server;
    /** ------------------------ 调度任务系统 ------------------------ */
    /** EineScheduler 计划任务调度器 */
    get scheduler(): EineScheduler | null;
    private _scheduler;
    static Logger: typeof EineLogger;
    static Painter: typeof EinePainter;
    static DB: typeof EineDB;
    static Axios: import("axios").AxiosStatic;
}
export * from "./common";
export * as Utils from "./utils";
export * as Filters from "./utils/internalFilter";
export default Eine;
