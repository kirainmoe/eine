"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eine = void 0;
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const constants_1 = require("constants");
const chalk_1 = __importDefault(require("chalk"));
const axios_1 = __importDefault(require("axios"));
const bind_decorator_1 = __importDefault(require("bind-decorator"));
/* Eine: typescript types */
const types_1 = require("./common/types");
/* Eine: constant & preset values */
const constant_1 = require("./common/constant");
const sender_1 = require("./common/sender");
/* Eine: libraries */
const logger_1 = __importDefault(require("./libs/logger"));
const painter_1 = __importDefault(require("./libs/painter"));
const db_1 = __importDefault(require("./libs/db"));
const scheduler_1 = __importDefault(require("./libs/scheduler"));
/* Eine: Adapter drivers */
const http_1 = __importDefault(require("./drivers/http"));
const ws_1 = __importDefault(require("./drivers/ws"));
/* Eine: Admin Panel server */
const server_1 = __importDefault(require("./server"));
/* Eine: small tools */
const serializeMessage_1 = __importDefault(require("./utils/serializeMessage"));
const injectExtraProperty_1 = __importDefault(require("./utils/injectExtraProperty"));
class Eine {
    /** Eine Framework 实例化选项 */
    eineOptions = constant_1.EINE_DEFAULT_OPTIONS;
    /** Driver 实例集合 */
    adapters = {};
    constructor(options = {}) {
        this.eineOptions = {
            ...this.eineOptions,
            ...options,
        };
        this._logger = new logger_1.default(this.eineOptions.logLevel, this.eineOptions.botName);
        this._painter = new painter_1.default(this);
        this._scheduler = new scheduler_1.default(this);
        this.eventHandler = new Map();
        this.interruptQueue = new Map();
        this.logger.info("Launching {}...", chalk_1.default.cyan(this.eineOptions.botName));
    }
    /** 初始化 */
    async init() {
        this.logger.info("Initializing framework features.");
        this.checkAppWorkspace();
        this.bindInternalEvents();
        if (this.eineOptions.enableDatabase) {
            this._db = new db_1.default(this.eineOptions.mongoConfig, this);
            await this.db?.connect();
        }
        if (this.eineOptions.enableServer) {
            if (!this.eineOptions.enableDatabase) {
                this.logger.warn("EineServer: panel requires database. please check `enableDatabase` option.");
            }
            else {
                this._server = new server_1.default(this);
                await this.server?.startServer();
            }
        }
        this.logger.info("{} {} {}", chalk_1.default.green("Initialization completed, bot"), chalk_1.default.cyan(this.eineOptions.botName), chalk_1.default.green("is ready."));
        this.logger.info("🎩 {} (v{})", chalk_1.default.red(`Powered by ${constant_1.EINE} Framework`), constant_1.EINE_VERSION);
    }
    /** 绑定内部事件 */
    bindInternalEvents() {
        this.logger.verbose("register interal events: ");
        this.on('AfterVerify')(this.afterVerify.bind(this));
        this.on('AfterBind')(this.afterBind.bind(this));
        this.on('SendMessage')(this.afterSendMessage.bind(this));
    }
    /** 检查工作空间是否存在 */
    checkAppWorkspace() {
        this.logger.verbose("checking workspace {} is available.", this.eineOptions.appDirectory);
        if (fs_1.existsSync(this.eineOptions.appDirectory)) {
            // 存在同名文件
            if (!fs_1.lstatSync(this.eineOptions.appDirectory).isDirectory) {
                this.logger.error("Cannot use {} as workspace: file exists", this.eineOptions.appDirectory);
                process.exit(1);
            }
            // 对文件夹没有读写访问权限
            try {
                fs_1.accessSync(this.eineOptions.appDirectory, constants_1.R_OK | constants_1.W_OK);
            }
            catch (err) {
                this.logger.error("Cannot use {} as workspace: permission for read/write denied.", this.eineOptions.appDirectory);
            }
            return true;
        }
        else {
            // 不存在文件夹则执行创建逻辑
            try {
                fs_1.mkdirSync(this.eineOptions.appDirectory);
            }
            catch (err) {
                this.logger.error("Creating workspace {} failed, {}", this.eineOptions.appDirectory, err);
            }
        }
    }
    getOption(key) {
        return this.eineOptions[key];
    }
    getVersion() {
        return constant_1.EINE_VERSION;
    }
    /* ------------------------ 生命周期 ------------------------ */
    /** 重启 BOT */
    async relaunch() {
        this.logger.info("received `relaunch` command, {} will be relaunched in 3 secs.", this.eineOptions.botName);
        setTimeout(() => {
            const child = child_process_1.spawn(process.argv[0], process.argv.slice(1), {
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
    async shutdown(exitCode = 0) {
        this.logger.info("received `shutdown` command, {} will be shutdown in 3 secs.", this.eineOptions.botName);
        setTimeout(() => process.exit(exitCode), 3000);
    }
    /* ------------------------ 认证系统 ------------------------ */
    /**
     * 与 mirai-api-http 进行身份验证
     * @returns Promise<any>
     */
    async verify() {
        const { adapters } = this.eineOptions;
        const verifyPromises = [];
        this.logger.info("Begin verify()");
        this.logger.verbose("Run: beforeVerify hooks.");
        this.dispatch(types_1.EineEventTypeStr.BEFORE_VERIFY, null);
        if (!adapters.http && !adapters.ws) {
            this.logger.error("Verify failed: no available adapter is found.");
            this.logger.tips("Supported adapters are: 'http', 'ws'.");
            this.logger.tips("Check the constructor options `{}` in your Eine App.", "adapters");
            return Promise.reject(false);
        }
        if (adapters.http) {
            this.adapters.http = new http_1.default({
                ...adapters.http,
                ...this.eineOptions,
            }, this);
            verifyPromises.push(this.adapters.http.verify().catch((err) => {
                this.logger.error("HTTP adapter verify failed.");
                delete this.adapters.http;
            }));
        }
        if (adapters.ws) {
            this.adapters.ws = new ws_1.default({
                ...adapters.ws,
                ...this.eineOptions,
            }, this);
            verifyPromises.push(this.adapters.ws.verify().catch((err) => {
                this.logger.error("Websocket adapter verify failed.");
                delete this.adapters.ws;
            }));
        }
        return Promise.all(verifyPromises).then((result) => {
            this.logger.success("End verify(): All adapters are verified.");
            this.dispatch(types_1.EineEventTypeStr.AFTER_VERIFY);
            return result;
        });
    }
    /**
     * 与 mirai-api-http 进行会话绑定 (仅 HttpAdapter)
     * @return Promise<any>
     */
    async bind() {
        if (!this.adapters.http) {
            this.logger.warn("No HTTP Adapter is configured. Skipping bind().");
            return;
        }
        this.logger.info("Begin bind()");
        this.logger.verbose("Run: beforeBind hooks.");
        this.dispatch(types_1.EineEventTypeStr.BEFORE_BIND, null);
        return this.adapters.http.bind().then((result) => {
            this.logger.success("End bind(): bind successfully.");
            this.dispatch(types_1.EineEventTypeStr.AFTER_BIND, null);
            return result;
        }).catch(err => {
            this.logger.error("HTTP adapter bind failed.");
        });
    }
    /* ------------------------ 日志系统 ------------------------ */
    /** Eine Logger 日志处理器 (readonly) */
    get logger() {
        return this._logger;
    }
    _logger;
    /**
     * 打印接收到的消息到 Log
     * @param sender
     * @param messageString
     */
    logMessage(sender, messageString) {
        let senderString;
        if (sender.nickname) {
            senderString = sender.nickname;
        }
        else if (sender.memberName) {
            senderString = sender.memberName + " -> " + sender.group.name;
        }
        else {
            senderString = sender.id;
        }
        if (this.eineOptions.enableMessageLog) {
            this.logger.message(senderString, messageString);
        }
    }
    /* ------------------------ 事件系统 ------------------------ */
    /** Eine Event 事件系统 */
    eventHandler;
    /** 中断响应队列 */
    interruptQueue;
    /** 是否正在处理中断，避免清理中断时覆盖 */
    isResolvingInterrupt = false;
    /**
     * 监听事件
     * Usage: eine.on(eventName1, [eventName2, ..., filter])(callback)
     * @returns (callback: EventCallback) => void
     * @param args (EineEventName | EventFilter)[]
     */
    on(...args) {
        const registerEvent = (event, callback, filters) => {
            const cb = callback;
            this.logger.verbose("registered event handler: {} -> {}.", event, cb.name.length ? cb.name : "(anonymous function)");
            if (this.eventHandler.has(event)) {
                this.eventHandler.get(event)?.push({ filters, callback: cb });
            }
            else {
                this.eventHandler.set(event, [{ filters, callback: cb }]);
            }
        };
        return (callback) => {
            const eventNames = new Set();
            let filters = [];
            args.forEach((arg) => {
                if (typeof arg === "string") {
                    // 接受所有类型的消息
                    if (arg === types_1.EineEventTypeStr.MESSAGE) {
                        types_1.messageEventType.forEach((event) => eventNames.add(event));
                        return;
                    }
                    eventNames.add(arg);
                }
                else if (typeof arg === "function") {
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
    wait(sender, type, iterator, filter, lifetime = 3600_000) {
        const group = sender.group;
        const key = JSON.stringify({
            id: sender.id,
            group: group ? group.id : undefined,
            type,
        });
        const triggerTime = +new Date();
        const interruptItem = { filter, iterator, triggerTime, lifetime };
        if (this.interruptQueue.has(key)) {
            this.interruptQueue.get(key)?.push(interruptItem);
        }
        else {
            this.interruptQueue.set(key, [interruptItem]);
        }
        return types_1.EventHandleResult.DONE;
    }
    /**
     * 触发一个事件
     * @param event 事件名称
     * @param payload 事件附带内容
     */
    async dispatch(event, payload = null) {
        const handlers = this.eventHandler.get(event); // 获取 EventHandler
        let extraParams = injectExtraProperty_1.default(event, payload, this); // 注入多余参数
        // 事件为好友消息、群消息、临时消息或陌生人消息，注入参数和回复方法并记录
        // 如果有关于该消息来源的中断请求，优先响应该中断
        if (types_1.messageEventType.includes(event)) {
            // logMessage 的优先级应当高于 interrupt，因此不使用监听，在此显式调用
            this.logMessage(payload.sender, extraParams.messageStr);
            if (this.eineOptions.enableDatabase && this.db.isConnected) {
                this.db.saveIncomingMessage(event, payload.sender, event === types_1.MessageTypeStr.GROUP_MESSAGE ? sender_1.GroupTarget(payload.sender.group.id) : sender_1.Myself(), payload.messageChain);
            }
            // 响应中断
            const group = payload.sender.group;
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
                let handleResult = types_1.EventHandleResult.CONTINUE;
                for (let i = 0; i < interrupts.length; i++) {
                    const interrupt = interrupts[i];
                    // 中断已经过期，不再响应
                    if (interrupt.triggerTime + interrupt.lifetime < currentTime) {
                        continue;
                    }
                    const filterResult = await interrupt.filter(payload, extraParams.messageStr);
                    if (!filterResult || handleResult === types_1.EventHandleResult.DONE) {
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
                if (handleResult === types_1.EventHandleResult.DONE) {
                    return;
                }
            }
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
                    if (!filterResult)
                        continue;
                }
                // generator function
                if (Object.prototype.toString.call(handler.callback) === "[object GeneratorFunction]") {
                    const iterator = handler.callback();
                    iterator.next();
                    const handleResult = iterator.next({
                        eine: this,
                        iterator,
                        ...payload,
                        ...extraParams,
                    }).value;
                    if (handleResult === types_1.EventHandleResult.DONE)
                        break;
                }
                // normal callback
                else {
                    const cb = handler.callback;
                    const handleResult = await cb({
                        eine: this,
                        ...payload,
                        ...extraParams,
                    });
                    if (handleResult === types_1.EventHandleResult.DONE) {
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
    resolveMessageAndEvent(message) {
        if (message instanceof Array) {
            message.map((msg) => this.dispatch(msg.type, msg));
        }
        else {
            this.dispatch(message.type, message);
        }
    }
    /* ------------------------ 绘图系统 ------------------------ */
    /** Eine Painter 实例 */
    get painter() {
        return this._painter;
    }
    get importFont() {
        return painter_1.default.importFont;
    }
    _painter;
    /* ------------------------ 事件钩子 ------------------------ */
    /** afterVerify Hook */
    afterVerify() {
        this.logger.verbose("Run: afterVerify hooks.");
        // 检查消息获取模式
        if (this.eineOptions.messagePullingMode === types_1.MessagePullingMode.PASSIVE_WS) {
            if (!this.adapters.ws) {
                this.logger.warn("WebSocket adapter is not found or verified failed.");
                this.logger.warn("messagePullingMode will be switched from `PASSIVE_WS` to `POLLING`.");
                this.eineOptions.messagePullingMode = types_1.MessagePullingMode.POLLING;
            }
            else {
                // todo: websocket connect
            }
        }
    }
    /** bound Hook */
    afterBind() {
        this.logger.verbose("Run: afterBind hooks.");
        if (this.eineOptions.messagePullingMode === types_1.MessagePullingMode.POLLING) {
            this.adapters.http.startPollingMessage(this.eineOptions.pollInterval);
        }
    }
    /** after send message Hook */
    afterSendMessage({ target, type, messageChain }) {
        let senderString = '';
        switch (type) {
            case types_1.MessageTypeStr.FRIEND_MESSAGE:
                senderString = `${this.eineOptions.botName} -> [Friend: ${target.id}]`;
                break;
            case types_1.MessageTypeStr.GROUP_MESSAGE:
                senderString = `${this.eineOptions.botName} -> [Group: ${target.group.id}]`;
                break;
            case types_1.MessageTypeStr.TEMP_MESSAGE:
                senderString = `${this.eineOptions.botName} -> [Temp: ${target.id}]`;
                break;
        }
        const messageString = serializeMessage_1.default(messageChain);
        if (this.eineOptions.enableMessageLog) {
            this.logger.message(senderString, messageString);
        }
        if (this.eineOptions.enableDatabase && this.db.isConnected) {
            this.db.saveOutgoingMessage(type, sender_1.Myself(), target, messageChain);
        }
    }
    /* ------------------------ 文档数据库 ------------------------ */
    /** EineDB - MongoDB 封装 */
    get db() { return this._db; }
    _db = null;
    /* ------------------------ 适配器驱动 ------------------------ */
    /**
     * 选择最适合的 Adapter Driver
     * @param property
     */
    pickBest(property) {
        if (!property)
            return this.adapters.ws;
        if (property && this.adapters.ws?.hasOwnProperty(property))
            return this.adapters.ws;
        return this.adapters.http;
    }
    /** 获取 HTTP Adapter 实例 */
    get http() { return this.adapters.http; }
    /** 获取 Websocket Adapter 实例 */
    get ws() { return this.adapters.ws; }
    /* ------------------------ AdminPanel 服务器 ------------------------ */
    get server() { return this._server; }
    _server = null;
    /** ------------------------ 调度任务系统 ------------------------ */
    get scheduler() { return this._scheduler; }
    _scheduler = null;
    /* 静态类型定义 */
    static Logger = logger_1.default;
    static Painter = painter_1.default;
    static DB = db_1.default;
    static Axios = axios_1.default;
}
__decorate([
    bind_decorator_1.default
], Eine.prototype, "init", null);
__decorate([
    bind_decorator_1.default
], Eine.prototype, "getOption", null);
__decorate([
    bind_decorator_1.default
], Eine.prototype, "getVersion", null);
__decorate([
    bind_decorator_1.default
], Eine.prototype, "relaunch", null);
__decorate([
    bind_decorator_1.default
], Eine.prototype, "shutdown", null);
__decorate([
    bind_decorator_1.default
], Eine.prototype, "verify", null);
__decorate([
    bind_decorator_1.default
], Eine.prototype, "bind", null);
__decorate([
    bind_decorator_1.default
], Eine.prototype, "wait", null);
__decorate([
    bind_decorator_1.default
], Eine.prototype, "dispatch", null);
__decorate([
    bind_decorator_1.default
], Eine.prototype, "resolveMessageAndEvent", null);
__decorate([
    bind_decorator_1.default
], Eine.prototype, "pickBest", null);
exports.Eine = Eine;
__exportStar(require("./common"), exports);
__exportStar(require("./drivers"), exports);
__exportStar(require("./libs"), exports);
__exportStar(require("./utils"), exports);
exports.default = Eine;
//# sourceMappingURL=index.js.map