"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Filters = exports.Utils = exports.Eine = void 0;
var cluster_1 = __importDefault(require("cluster"));
var child_process_1 = require("child_process");
var fs_1 = require("fs");
var constants_1 = require("constants");
var chalk_1 = __importDefault(require("chalk"));
var axios_1 = __importDefault(require("axios"));
var bind_decorator_1 = __importDefault(require("bind-decorator"));
var uuid_1 = require("uuid");
/* Eine: typescript types */
var types_1 = require("./common/types");
var EventType_1 = require("./common/types/EventType");
/* Eine: constant & preset values */
var constant_1 = require("./common/constant");
var sendTarget_1 = require("./common/sendTarget");
/* Eine: libraries */
var logger_1 = __importDefault(require("./libs/logger"));
var painter_1 = __importDefault(require("./libs/painter"));
var db_1 = __importDefault(require("./libs/db"));
var scheduler_1 = __importDefault(require("./libs/scheduler"));
/* Eine: Adapter drivers */
var http_1 = __importDefault(require("./drivers/http"));
var ws_1 = __importDefault(require("./drivers/ws"));
/* Eine: Admin Panel server */
var server_1 = __importDefault(require("./server"));
/* Eine: small tools */
var serializeMessage_1 = __importDefault(require("./utils/serializeMessage"));
var injectExtraProperty_1 = __importDefault(require("./utils/injectExtraProperty"));
/**
 * @package @eine-nineteen/eine
 * @module Eine
 * @author Yume<kirainmoe@gmail.com>
 * @licence MIT
 */
var Eine = /** @class */ (function () {
    function Eine(options) {
        if (options === void 0) { options = {}; }
        /** Eine Framework 实例化选项 */
        this.eineOptions = constant_1.EINE_DEFAULT_OPTIONS;
        /** Driver 实例集合 */
        this.adapters = {};
        /** 是否正在处理中断，避免清理中断时覆盖 */
        this.isResolvingInterrupt = false;
        this._db = null;
        this._server = null;
        this._scheduler = null;
        this.eineOptions = __assign(__assign({}, this.eineOptions), options);
        this._logger = new logger_1.default(this.eineOptions.logLevel, this.eineOptions.botName);
        this._painter = new painter_1.default(this);
        this._scheduler = new scheduler_1.default(this);
        this.eventHandler = new Map();
        this.interruptQueue = new Map();
        this._clusterRole = this.eineOptions.enableConcurrent
            ? cluster_1.default.isWorker
                ? types_1.ClusterRole.SECONDARY
                : types_1.ClusterRole.PRIMARY
            : types_1.ClusterRole.PRIMARY;
        if (this.clusterRole === types_1.ClusterRole.PRIMARY) {
            this.logger.info("Launching {}...", chalk_1.default.cyan(this.eineOptions.botName));
        }
        else {
            this.logger.info("Concurrent Mode: secondary node {} launched.", process.env.EINE_PROCESS_INDEX);
            // 并发进程不支持 Websocket 模式
            this.eineOptions.messagePullingMode = types_1.MessagePullingMode.POLLING;
            this.eineOptions.messageBatchCount = 1;
        }
    }
    Object.defineProperty(Eine.prototype, "clusterRole", {
        get: function () { return this._clusterRole; },
        enumerable: false,
        configurable: true
    });
    /** 初始化 */
    Eine.prototype.init = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (this.clusterRole === types_1.ClusterRole.PRIMARY) {
                            this.logger.info("Initializing framework features.");
                            this.checkAppWorkspace();
                        }
                        this.bindInternalEvents();
                        if (!this.eineOptions.enableDatabase) return [3 /*break*/, 2];
                        this._db = new db_1.default(this.eineOptions.mongoConfig, this);
                        return [4 /*yield*/, ((_a = this.db) === null || _a === void 0 ? void 0 : _a.connect())];
                    case 1:
                        _c.sent();
                        _c.label = 2;
                    case 2:
                        if (!(this.clusterRole === types_1.ClusterRole.PRIMARY)) return [3 /*break*/, 6];
                        if (!this.eineOptions.enableServer) return [3 /*break*/, 5];
                        if (!!this.eineOptions.enableDatabase) return [3 /*break*/, 3];
                        this.logger.warn("EineServer: panel requires database. please check `enableDatabase` option.");
                        return [3 /*break*/, 5];
                    case 3:
                        this._server = new server_1.default(this);
                        return [4 /*yield*/, ((_b = this.server) === null || _b === void 0 ? void 0 : _b.startServer())];
                    case 4:
                        _c.sent();
                        _c.label = 5;
                    case 5:
                        this.logger.info("{} {} {}", chalk_1.default.green("Initialization completed, bot"), chalk_1.default.cyan(this.eineOptions.botName), chalk_1.default.green("is ready."));
                        this.logger.info("🎩 {} (v{})", chalk_1.default.red("Powered by " + constant_1.EINE + " Framework"), constant_1.EINE_VERSION);
                        _c.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /** 绑定内部事件 */
    Eine.prototype.bindInternalEvents = function () {
        this.logger.verbose("register interal events: ");
        this.on('AfterVerify')(this.afterVerify.bind(this));
        this.on('AfterBind')(this.afterBind.bind(this));
        this.on('SendMessage')(this.afterSendMessage.bind(this));
    };
    /** 检查工作空间是否存在 */
    Eine.prototype.checkAppWorkspace = function () {
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
    };
    /**
     * 根据关键字获取 EineOptions 的值
     * @param key 关键字
     * @returns any
     */
    Eine.prototype.getOption = function (key) {
        return this.eineOptions[key];
    };
    /**
     * 获取 Eine 版本号
     * @returns number
     */
    Eine.prototype.getVersion = function () {
        return constant_1.EINE_VERSION;
    };
    /* ------------------------ 生命周期 ------------------------ */
    /** 重启 BOT */
    Eine.prototype.relaunch = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_b) {
                if (this.clusterRole !== types_1.ClusterRole.PRIMARY) {
                    (_a = process.send) === null || _a === void 0 ? void 0 : _a.call(process, "EINE_COMMAND_RELAUNCH");
                    return [2 /*return*/];
                }
                this.logger.info("received `relaunch` command, {} will be relaunched in 3 secs.", this.eineOptions.botName);
                setTimeout(function () {
                    var child = child_process_1.spawn(process.argv[0], process.argv.slice(1), {
                        detached: true,
                        stdio: "inherit",
                    });
                    child.unref();
                    _this.logger.success("relaunched {}, parent process is exiting.", _this.eineOptions.botName);
                    process.exit(0);
                }, 3000);
                return [2 /*return*/];
            });
        });
    };
    /**
     * 停止 BOT
     * @param exitCode 返回码
     */
    Eine.prototype.shutdown = function (exitCode) {
        var _a;
        if (exitCode === void 0) { exitCode = 0; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                if (this.clusterRole !== types_1.ClusterRole.PRIMARY) {
                    (_a = process.send) === null || _a === void 0 ? void 0 : _a.call(process, "EINE_COMMAND_SHUTDOWN");
                    return [2 /*return*/];
                }
                this.logger.info("received `shutdown` command, {} will be shutdown in 3 secs.", this.eineOptions.botName);
                setTimeout(function () { return process.exit(exitCode); }, 3000);
                return [2 /*return*/];
            });
        });
    };
    /* ------------------------ 认证系统 ------------------------ */
    /**
     * 与 mirai-api-http 进行身份验证
     * @returns Promise<any>
     */
    Eine.prototype.verify = function () {
        return __awaiter(this, void 0, void 0, function () {
            var adapters, verifyPromises;
            var _this = this;
            return __generator(this, function (_a) {
                adapters = this.eineOptions.adapters;
                verifyPromises = [];
                if (this.clusterRole === types_1.ClusterRole.PRIMARY) {
                    this.logger.info("Begin verify()");
                    this.logger.verbose("Run: beforeVerify hooks.");
                    this.dispatch(types_1.EineEventTypeStr.BEFORE_VERIFY, null);
                }
                if (!adapters.http && !adapters.ws) {
                    this.logger.error("Verify failed: no available adapter is found.");
                    this.logger.tips("Supported adapters are: 'http', 'ws'.");
                    this.logger.tips("Check the constructor options `{}` in your Eine App.", "adapters");
                    return [2 /*return*/, Promise.reject(false)];
                }
                if (adapters.http) {
                    this.adapters.http = new http_1.default(__assign(__assign({}, adapters.http), this.eineOptions), this);
                    verifyPromises.push(this.adapters.http
                        .verify(this.clusterRole === types_1.ClusterRole.PRIMARY ? undefined : process.env.EINE_HTTP_SESSION)
                        .catch(function (err) {
                        _this.logger.error("HTTP adapter verify failed.");
                        delete _this.adapters.http;
                    }));
                }
                // 只有主进程才建立 websocket 连接
                if (adapters.ws && this.clusterRole === types_1.ClusterRole.PRIMARY) {
                    this.adapters.ws = new ws_1.default(__assign(__assign({}, adapters.ws), this.eineOptions), this);
                    verifyPromises.push(this.adapters.ws.verify().catch(function (err) {
                        _this.logger.error("Websocket adapter verify failed.");
                        delete _this.adapters.ws;
                    }));
                }
                return [2 /*return*/, Promise.all(verifyPromises).then(function (result) {
                        if (_this.clusterRole === types_1.ClusterRole.PRIMARY) {
                            _this.logger.success("End verify(): All adapters are verified.");
                            _this.dispatch(types_1.EineEventTypeStr.AFTER_VERIFY);
                        }
                        return result;
                    })];
            });
        });
    };
    /**
     * 与 mirai-api-http 进行会话绑定 (仅 HttpAdapter)
     * @return Promise<any>
     */
    Eine.prototype.bind = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (this.clusterRole !== types_1.ClusterRole.PRIMARY) {
                    if (this.eineOptions.messagePullingMode === types_1.MessagePullingMode.POLLING) {
                        this.adapters.http.startPollingMessage(this.eineOptions.pollInterval);
                    }
                    return [2 /*return*/];
                }
                if (!this.adapters.http) {
                    this.logger.warn("No HTTP Adapter is configured. Skipping bind().");
                    return [2 /*return*/];
                }
                this.logger.info("Begin bind()");
                this.logger.verbose("Run: beforeBind hooks.");
                this.dispatch(types_1.EineEventTypeStr.BEFORE_BIND, null);
                this.logger.verbose("beforeBind OK");
                return [2 /*return*/, this.adapters.http.bind().then(function (result) {
                        _this.logger.success("End bind(): bind successfully.");
                        _this.dispatch(types_1.EineEventTypeStr.AFTER_BIND, null);
                        return result;
                    }).catch(function (err) {
                        _this.logger.error("HTTP adapter bind failed.");
                    })];
            });
        });
    };
    Object.defineProperty(Eine.prototype, "logger", {
        /* ------------------------ 日志系统 ------------------------ */
        /** Eine Logger 日志处理器 (readonly) */
        get: function () {
            return this._logger;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * 打印接收到的消息到 Log
     * @param sender
     * @param messageString
     */
    Eine.prototype.logMessage = function (sender, messageString) {
        var senderString;
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
    };
    /**
     * 监听事件
     * Usage: eine.on(eventName1, [eventName2, ..., filter])(callback)
     * @returns (callback: EventCallback) => void
     * @param args (EineEventName | EventFilter)[]
     */
    Eine.prototype.on = function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var registerEvent = function (event, callback, filters) {
            var _a;
            var cb = callback;
            _this.logger.verbose("registered event handler: {} -> {}.", event, cb.name.length ? cb.name : "(anonymous function)");
            if (_this.eventHandler.has(event)) {
                (_a = _this.eventHandler.get(event)) === null || _a === void 0 ? void 0 : _a.push({ filters: filters, callback: cb });
            }
            else {
                _this.eventHandler.set(event, [{ filters: filters, callback: cb }]);
            }
        };
        return function (callback) {
            var eventNames = new Set();
            var filters = [];
            args.forEach(function (arg) {
                if (typeof arg === "string") {
                    // 接受所有类型的消息
                    if (arg === types_1.EineEventTypeStr.MESSAGE) {
                        types_1.messageEventType.forEach(function (event) { return eventNames.add(event); });
                        return;
                    }
                    eventNames.add(arg);
                }
                else if (typeof arg === "function") {
                    filters.push(arg);
                }
            });
            eventNames.forEach(function (eventName) { return registerEvent(eventName, callback, filters); });
        };
    };
    /**
     * 中断处理函数，等待条件满足时唤醒继续执行
     * @param sender 等待信息发送者
     * @param type 等待信息类型
     * @param iterator 处理函数的 generator iterator
     * @param filter 条件函数
     * @param lifetime 中断等待最长时间，默认为 1 小时
     */
    Eine.prototype.wait = function (sender, type, iterator, filter, lifetime) {
        var _this = this;
        var _a;
        if (lifetime === void 0) { lifetime = 3600000; }
        var group = sender.group;
        var key = JSON.stringify({
            id: sender.id,
            group: group ? group.id : undefined,
            type: type,
        });
        var triggerTime = +new Date();
        var interruptId = uuid_1.v4();
        var interruptItem = { interruptId: interruptId, filter: filter, iterator: iterator, triggerTime: triggerTime, lifetime: lifetime };
        if (this.interruptQueue.has(key)) {
            (_a = this.interruptQueue.get(key)) === null || _a === void 0 ? void 0 : _a.push(interruptItem);
        }
        else {
            this.interruptQueue.set(key, [interruptItem]);
        }
        // 定时取消
        setTimeout(function () { return _this.cancelWait(key, interruptId); }, lifetime);
        return {
            key: key,
            interruptId: interruptId,
        };
    };
    /**
     * 取消中断
     * @param key 中断 key
     * @param interruptId 事件处理器 ID
     */
    Eine.prototype.cancelWait = function (key, interruptId) {
        var queue = this.interruptQueue.get(key);
        if (queue) {
            this.interruptQueue.set(key, queue.filter(function (item) { return item.interruptId !== interruptId; }));
        }
    };
    /**
     * 触发一个事件
     * @param event 事件名称
     * @param payload 事件附带内容
     */
    Eine.prototype.dispatch = function (event, payload) {
        var _a;
        if (payload === void 0) { payload = null; }
        return __awaiter(this, void 0, void 0, function () {
            var handlers, extraParams, group, interruptKey, interrupts, reservedInterrupts, currentTime, handleResult, i, interrupt, filterResult, _i, handlers_1, handler, filterResult, _b, _c, filter, _d, iterator, handleResult, cb, handleResult;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        handlers = this.eventHandler.get(event);
                        extraParams = injectExtraProperty_1.default(event, payload, this);
                        if (!types_1.messageEventType.includes(event)) return [3 /*break*/, 6];
                        if (this.clusterRole === types_1.ClusterRole.PRIMARY) {
                            // logMessage 的优先级应当高于 interrupt，因此不使用监听，在此显式调用
                            this.logMessage(payload.sender, extraParams.messageStr);
                            // 管理面板 pushMessage
                            if (this.eineOptions.enableServer) {
                                (_a = this.server) === null || _a === void 0 ? void 0 : _a.pushMessage({
                                    type: event,
                                    sender: payload.sender,
                                    messageChain: payload.messageChain,
                                    str: extraParams.messageStr,
                                });
                            }
                            // 保存信息到数据库
                            if (this.eineOptions.enableDatabase && this.db.isConnected) {
                                this.db.saveIncomingMessage(event, payload.sender, event === types_1.MessageTypeStr.GROUP_MESSAGE ? sendTarget_1.GroupTarget(payload.sender.group.id) : sendTarget_1.Myself(), payload.messageChain);
                            }
                        }
                        group = payload.sender.group;
                        interruptKey = JSON.stringify({
                            id: payload.sender.id,
                            group: group ? group.id : undefined,
                            type: payload.type,
                        });
                        interrupts = this.interruptQueue.get(interruptKey);
                        reservedInterrupts = [];
                        currentTime = +new Date();
                        if (!interrupts) return [3 /*break*/, 6];
                        this.isResolvingInterrupt = true;
                        handleResult = types_1.EventHandleResult.CONTINUE;
                        i = 0;
                        _e.label = 1;
                    case 1:
                        if (!(i < interrupts.length)) return [3 /*break*/, 5];
                        interrupt = interrupts[i];
                        // 中断已经过期，不再响应
                        if (interrupt.triggerTime + interrupt.lifetime < currentTime) {
                            return [3 /*break*/, 4];
                        }
                        return [4 /*yield*/, interrupt.filter(payload, extraParams.messageStr)];
                    case 2:
                        filterResult = _e.sent();
                        if (!filterResult || handleResult === types_1.EventHandleResult.DONE) {
                            reservedInterrupts.push(interrupt);
                            return [3 /*break*/, 4];
                        }
                        return [4 /*yield*/, interrupt.iterator.next(__assign(__assign({ eine: this, iterator: interrupt.iterator }, payload), extraParams)).value];
                    case 3:
                        handleResult = _e.sent();
                        _e.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 1];
                    case 5:
                        this.interruptQueue.set(interruptKey, reservedInterrupts);
                        this.isResolvingInterrupt = false;
                        if (handleResult === types_1.EventHandleResult.DONE) {
                            return [2 /*return*/];
                        }
                        _e.label = 6;
                    case 6:
                        if (!handlers) return [3 /*break*/, 17];
                        _i = 0, handlers_1 = handlers;
                        _e.label = 7;
                    case 7:
                        if (!(_i < handlers_1.length)) return [3 /*break*/, 17];
                        handler = handlers_1[_i];
                        if (!handler.filters) return [3 /*break*/, 13];
                        filterResult = true;
                        _b = 0, _c = handler.filters;
                        _e.label = 8;
                    case 8:
                        if (!(_b < _c.length)) return [3 /*break*/, 12];
                        filter = _c[_b];
                        _d = filterResult;
                        if (!_d) return [3 /*break*/, 10];
                        return [4 /*yield*/, filter(payload, extraParams.messageStr)];
                    case 9:
                        _d = (_e.sent());
                        _e.label = 10;
                    case 10:
                        filterResult = _d;
                        if (!filterResult)
                            return [3 /*break*/, 12];
                        _e.label = 11;
                    case 11:
                        _b++;
                        return [3 /*break*/, 8];
                    case 12:
                        if (!filterResult)
                            return [3 /*break*/, 16];
                        _e.label = 13;
                    case 13:
                        if (!(Object.prototype.toString.call(handler.callback) === "[object GeneratorFunction]")) return [3 /*break*/, 14];
                        if (this.clusterRole !== types_1.ClusterRole.PRIMARY) {
                            return [3 /*break*/, 16];
                        }
                        iterator = handler.callback();
                        iterator.next();
                        handleResult = iterator.next(__assign(__assign({ eine: this, iterator: iterator }, payload), extraParams)).value;
                        if (handleResult === types_1.EventHandleResult.DONE)
                            return [3 /*break*/, 17];
                        return [3 /*break*/, 16];
                    case 14:
                        if (this.eineOptions.enableConcurrent &&
                            this.clusterRole === types_1.ClusterRole.PRIMARY &&
                            (types_1.messageEventType.includes(event) || EventType_1.botEventType.includes(event)))
                            return [3 /*break*/, 16];
                        cb = handler.callback;
                        return [4 /*yield*/, cb(__assign(__assign({ eine: this }, payload), extraParams))];
                    case 15:
                        handleResult = _e.sent();
                        if (handleResult === types_1.EventHandleResult.DONE) {
                            return [2 /*return*/];
                        }
                        _e.label = 16;
                    case 16:
                        _i++;
                        return [3 /*break*/, 7];
                    case 17: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 处理消息和事件
     * @param message 消息 & 事件
     */
    Eine.prototype.resolveMessageAndEvent = function (message) {
        var _this = this;
        if (message instanceof Array) {
            message.map(function (msg) { return _this.dispatch(msg.type, msg); });
        }
        else {
            this.dispatch(message.type, message);
        }
    };
    Object.defineProperty(Eine.prototype, "painter", {
        /* ------------------------ 绘图系统 ------------------------ */
        /** Eine Painter 实例 */
        get: function () {
            return this._painter;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Eine.prototype, "importFont", {
        get: function () {
            return painter_1.default.importFont;
        },
        enumerable: false,
        configurable: true
    });
    /* ------------------------ 事件钩子 ------------------------ */
    /** afterVerify Hook */
    Eine.prototype.afterVerify = function () {
        this.logger.verbose("Run: afterVerify hooks.");
        // 检查消息获取模式
        if (this.eineOptions.messagePullingMode === types_1.MessagePullingMode.PASSIVE_WS) {
            if (!this.adapters.ws) {
                this.logger.warn("WebSocket adapter is not found or verified failed.");
                this.logger.warn("messagePullingMode will be switched from `PASSIVE_WS` to `POLLING`.");
                this.eineOptions.messagePullingMode = types_1.MessagePullingMode.POLLING;
            }
        }
    };
    /** bound Hook */
    Eine.prototype.afterBind = function () {
        var _this = this;
        var _a;
        this.logger.verbose("Run: afterBind hooks.");
        for (var i = 0; this.eineOptions.enableConcurrent && i < this.eineOptions.maxConcurrentNumber; i++) {
            cluster_1.default.fork({
                EINE_PROCESS_INDEX: i,
                EINE_PROCESS_SECONDARY: true,
                EINE_HTTP_SESSION: (_a = this.adapters.http) === null || _a === void 0 ? void 0 : _a.session,
            });
            cluster_1.default.on("message", function (message) {
                return _this.dispatch(types_1.EineEventTypeStr.PROCESS_MESSAGE, {
                    message: message,
                });
            });
        }
        if (this.eineOptions.messagePullingMode === types_1.MessagePullingMode.POLLING) {
            this.adapters.http.startPollingMessage(this.eineOptions.pollInterval);
        }
    };
    /** after send message Hook */
    Eine.prototype.afterSendMessage = function (_a) {
        var target = _a.target, type = _a.type, messageChain = _a.messageChain;
        var senderString = '';
        switch (type) {
            case types_1.MessageTypeStr.FRIEND_MESSAGE:
                senderString = this.eineOptions.botName + " -> [Friend: " + target.id + "]";
                break;
            case types_1.MessageTypeStr.GROUP_MESSAGE:
                senderString = this.eineOptions.botName + " -> [Group: " + target.group.id + "]";
                break;
            case types_1.MessageTypeStr.TEMP_MESSAGE:
                senderString = this.eineOptions.botName + " -> [Temp: " + target.id + "]";
                break;
        }
        var messageString = serializeMessage_1.default(messageChain);
        if (this.eineOptions.enableMessageLog) {
            this.logger.message(senderString, messageString);
        }
        if (this.eineOptions.enableDatabase && this.db.isConnected) {
            this.db.saveOutgoingMessage(type, sendTarget_1.Myself(), target, messageChain);
        }
    };
    Eine.prototype.recevingProcessMessage = function (_a) {
        var message = _a.message;
        console.log("Receving ", message);
        if (message === "EINE_COMMAND_RELAUNCH") {
            return this.relaunch();
        }
        if (message === "EINE_COMMAND_SHUTDOWN") {
            return this.shutdown();
        }
    };
    Object.defineProperty(Eine.prototype, "db", {
        /* ------------------------ 文档数据库 ------------------------ */
        /** EineDB - MongoDB 封装 */
        get: function () { return this._db; },
        enumerable: false,
        configurable: true
    });
    /* ------------------------ 适配器驱动 ------------------------ */
    /**
     * 选择最适合的 Adapter Driver
     * @param property
     */
    Eine.prototype.pickBest = function (property) {
        var _a;
        if (!property && this.adapters.ws)
            return this.adapters.ws;
        if (property && ((_a = this.adapters.ws) === null || _a === void 0 ? void 0 : _a.hasOwnProperty(property)))
            return this.adapters.ws;
        return this.adapters.http;
    };
    Object.defineProperty(Eine.prototype, "http", {
        /** 获取 HTTP Adapter 实例 */
        get: function () { return this.adapters.http; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Eine.prototype, "ws", {
        /** 获取 Websocket Adapter 实例 */
        get: function () { return this.adapters.ws; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Eine.prototype, "server", {
        /* ------------------------ AdminPanel 服务器 ------------------------ */
        /** EineServer 管理面板服务器 */
        get: function () { return this._server; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Eine.prototype, "scheduler", {
        /** ------------------------ 调度任务系统 ------------------------ */
        /** EineScheduler 计划任务调度器 */
        get: function () { return this._scheduler; },
        enumerable: false,
        configurable: true
    });
    /* 静态类型定义 */
    Eine.Logger = logger_1.default;
    Eine.Painter = painter_1.default;
    Eine.DB = db_1.default;
    Eine.Axios = axios_1.default;
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
    ], Eine.prototype, "cancelWait", null);
    __decorate([
        bind_decorator_1.default
    ], Eine.prototype, "dispatch", null);
    __decorate([
        bind_decorator_1.default
    ], Eine.prototype, "resolveMessageAndEvent", null);
    __decorate([
        bind_decorator_1.default
    ], Eine.prototype, "pickBest", null);
    return Eine;
}());
exports.Eine = Eine;
__exportStar(require("./common"), exports);
exports.Utils = __importStar(require("./utils"));
exports.Filters = __importStar(require("./utils/internalFilter"));
exports.default = Eine;
//# sourceMappingURL=index.js.map