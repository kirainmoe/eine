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
var ws_1 = __importDefault(require("ws"));
var types_1 = require("../../common/types");
var MessageComponentType_1 = require("../../common/types/MessageComponentType");
var component_1 = require("../../common/component");
var types_2 = require("./types");
var sendTarget_1 = require("../../common/sendTarget");
/**
 * mirai-api-http: Websocket Adapter Driver
 */
var WebsocketDriver = /** @class */ (function () {
    function WebsocketDriver(options, parent) {
        var _this = this;
        /** Websocket 客户端实例 */
        this.ws = null;
        /** Websocket syncId */
        this.syncId = 0;
        /** Websocket resolver map */
        this.syncMap = new Map();
        /**
         * 处理从 websocket 接受的消息
         * @param message 消息内容
         * @param resolve
         * @param reject
         */
        this.resolveMessage = function (message, resolve, reject) {
            var _a, _b;
            try {
                var payload = JSON.parse(message);
                if (payload.syncId === undefined || payload.syncId === "") {
                    if (_this.sessionState === types_2.WebsocketSessionState.IDLE) {
                        if (payload.code && payload.code !== 0) {
                            _this.logger.error("WebsocketDriver: verify failed, Error: {} ({})", payload.msg, payload.code);
                            reject === null || reject === void 0 ? void 0 : reject(payload.msg);
                        }
                        else {
                            _this._session = payload.data.session;
                            _this._sessionState = types_2.WebsocketSessionState.VERIFIED;
                            _this.logger.verbose("WebsocketDriver: succesfully verified, current session is {}", _this.session);
                            _this.logger.verbose("WebsockerDriver: session {} successfully binded with QQ: {}", _this.session, _this.options.qq);
                            resolve === null || resolve === void 0 ? void 0 : resolve(_this._sessionState);
                        }
                        return;
                    }
                    if (payload.data && payload.data.type) {
                        _this.eine.dispatch(payload.data.type, payload.data);
                        return;
                    }
                    _this.logger.warn("WebsocketDriver: received message with unknown type: {}", message);
                }
                else {
                    var syndId = Number(payload.syncId);
                    if (Number(syndId) === -1) {
                        _this.eine.resolveMessageAndEvent(payload.data);
                        return;
                    }
                    if (payload.data.code !== undefined && payload.data.code !== 0) {
                        (_a = _this.syncMap.get(syndId)) === null || _a === void 0 ? void 0 : _a.reject(payload.data.msg);
                        return;
                    }
                    (_b = _this.syncMap.get(syndId)) === null || _b === void 0 ? void 0 : _b.resolve(payload.data ? payload.data : payload);
                }
            }
            catch (err) {
                _this.logger.error("WebsocketDriver: parse incoming message failed, {}", err);
            }
        };
        /**
         * 通过 websocket 发送命令字和接口数据对象
         * @param command 命令字
         * @param content 数据对象
         * @param subCommand 子命令字，可为 null
         * @returns Promise<any>
         */
        this.command = function (command, content, subCommand) {
            if (content === void 0) { content = {}; }
            if (subCommand === void 0) { subCommand = null; }
            return _this.sendAndWaitResponse({
                command: command,
                subCommand: subCommand,
                content: __assign(__assign({}, content), { sessionKey: _this.session }),
            });
        };
        this.options = options;
        this.eine = parent;
        this._logger = parent.logger;
        var host = options.host, port = options.port;
        this.apiHost =
            host.startsWith("ws://") || host.startsWith("wss://") ? host + ":" + port + "/all" : "ws://" + host + ":" + port + "/all";
        this._session = "";
        this._sessionState = types_2.WebsocketSessionState.IDLE;
        this.logger.verbose("WebsocketDriver: baseUrl = {}", this.apiHost);
    }
    Object.defineProperty(WebsocketDriver.prototype, "logger", {
        get: function () {
            return this._logger;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WebsocketDriver.prototype, "session", {
        /** sessionKey */
        get: function () {
            return this._session;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WebsocketDriver.prototype, "sessionState", {
        /** 会话状态 */
        get: function () {
            return this._sessionState;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * 设置实例身份（QQ 号）
     * @param qq
     */
    WebsocketDriver.prototype.setIdentity = function (qq) {
        this.options.qq = qq;
    };
    Object.defineProperty(WebsocketDriver.prototype, "nextSyncId", {
        /** 获取下一个标识信息的 ID */
        get: function () {
            if (this.syncId >= Number.MAX_SAFE_INTEGER)
                return (this.syncId = 0);
            return this.syncId++;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * 通过 websocket 发送消息并等待响应
     * @param payload 消息内容
     */
    WebsocketDriver.prototype.sendAndWaitResponse = function (payload) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                if (!_this.ws) {
                    _this.logger.error("sendAndWaitResponse @ WebsocketDriver: failed to send because websocket is not created.");
                    reject("Websocket not created");
                    return;
                }
                var syncId_1 = _this.nextSyncId;
                // time limit for receiving websocket message
                var timeout_1 = setTimeout(function () {
                    _this.syncMap.delete(syncId_1);
                    reject("wait response timeout");
                }, _this.eine.getOption("responseTimeout"));
                var resolveAndClean = function (payload) {
                    clearTimeout(timeout_1);
                    _this.syncMap.delete(syncId_1);
                    resolve(payload);
                };
                var rejectAndClean = function (reason) {
                    clearTimeout(timeout_1);
                    _this.syncMap.delete(syncId_1);
                    reject(reason);
                };
                _this.syncMap.set(syncId_1, {
                    resolve: resolveAndClean,
                    reject: rejectAndClean,
                });
                _this.ws.send(typeof payload === "string"
                    ? payload
                    : JSON.stringify(__assign(__assign({}, payload), { syncId: syncId_1 })));
            }
            catch (err) {
                _this.logger.error("sendAndWaitResponse @ WebsocketDriver: failed to send because {}", err);
                reject(err);
            }
        });
    };
    /**
     * 会话认证流程，成功认证会由 resolve 返回 sessionID
     * @returns Promise<string>
     */
    WebsocketDriver.prototype.verify = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.ws = new ws_1.default(_this.apiHost + "?verifyKey=" + _this.options.verifyKey + "&qq=" + _this.options.qq, {
                perMessageDeflate: false,
            });
            _this.ws.on("message", function (message) {
                _this.resolveMessage(message, resolve, reject);
            });
            _this.ws.on("close", function () {
                _this.logger.info("WebsocketDriver: websocket connection closed.");
            });
            _this.ws.on("error", function (err) {
                _this.logger.error("WebsocketDriver: connection error, {}", err);
            });
        });
    };
    /** 释放会话，关闭 websocket 连接 */
    WebsocketDriver.prototype.release = function () {
        var _a;
        (_a = this.ws) === null || _a === void 0 ? void 0 : _a.close();
        this.logger.verbose("Session {} successfully released.", this.session);
    };
    /**
     * 处理待发送的信息，如上传未上传的图片等
     * @param messageChain 消息链
     * @param type 发送的信息类别
     * @returns MessageChain 处理后的消息链
     */
    WebsocketDriver.prototype.processMessageChain = function (messageChain, type) {
        return __awaiter(this, void 0, void 0, function () {
            var processed, index, component, pendingFile, uploadResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        processed = [];
                        index = 0;
                        _a.label = 1;
                    case 1:
                        if (!(index < messageChain.length)) return [3 /*break*/, 6];
                        component = messageChain[index];
                        if (!(typeof component === "string")) return [3 /*break*/, 2];
                        processed.push(component_1.Plain(component));
                        return [3 /*break*/, 5];
                    case 2:
                        if (!(component.type === MessageComponentType_1.MessageComponentTypeStr.PRELOAD)) return [3 /*break*/, 4];
                        pendingFile = component;
                        if (!this.eine.http) {
                            this.logger.warn("processMessageChain @ WebsocketDriver: uploading file requires HttpDriver which cannot be found, skipping upload {}.", pendingFile.file);
                            return [3 /*break*/, 5];
                        }
                        return [4 /*yield*/, (pendingFile.originType === MessageComponentType_1.MessageComponentTypeStr.VOICE
                                ? this.eine.http.uploadVoice(pendingFile, type)
                                : this.eine.http.uploadImage(pendingFile, type))];
                    case 3:
                        uploadResult = _a.sent();
                        if (uploadResult === null)
                            return [3 /*break*/, 5];
                        processed.push(__assign({ type: pendingFile.originType }, uploadResult));
                        return [3 /*break*/, 5];
                    case 4:
                        processed.push(component);
                        _a.label = 5;
                    case 5:
                        index++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/, processed];
                }
            });
        });
    };
    /**
     * 获取插件版本
     * @returns Promise
     */
    WebsocketDriver.prototype.about = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.command("about")];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 2:
                        err_1 = _a.sent();
                        this.logger.error("about @ WebsocketDriver, {}", err_1);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 通过 messageId 获取消息
     * @param messageId 消息 ID
     * @returns Promise<MessageType | null>
     */
    WebsocketDriver.prototype.messageFromId = function (messageId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.command("messageFromId", {
                                id: messageId,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 2:
                        err_2 = _a.sent();
                        this.logger.error("messageFromId @ WebsocketDriver: {}", err_2);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 获取好友列表
     * @returns Promise<Friend[]>
     */
    WebsocketDriver.prototype.friendList = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.command("friendList")];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 2:
                        err_3 = _a.sent();
                        this.logger.error("friendList @ WebsocketDriver: {}", err_3);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 获取群列表
     * @returns Promise<Group[]>
     */
    WebsocketDriver.prototype.groupList = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.command("groupList")];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 2:
                        err_4 = _a.sent();
                        this.logger.error("groupList @ WebsocketDriver: {}", err_4);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 获取群成员列表
     * @param groupId 群号
     * @returns Promise<GroupMember[]>
     */
    WebsocketDriver.prototype.memberList = function (groupId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.command("memberList", {
                                target: groupId,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 2:
                        err_5 = _a.sent();
                        this.logger.error("memberList @ WebsocketDriver: {}", err_5);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 获取 BOT 资料
     * @returns Promise<Profile | null>
     */
    WebsocketDriver.prototype.botProfile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.command("botProfile")];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 2:
                        err_6 = _a.sent();
                        this.logger.error("botProfile @ WebsocketDriver: {}", err_6);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 获取好友资料
     * @param friendId 好友 QQ 号
     * @returns Promise<Profile | null>
     */
    WebsocketDriver.prototype.friendProfile = function (friendId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.command("friendProfile", {
                                target: friendId,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 2:
                        err_7 = _a.sent();
                        this.logger.error("friendProfile @ WebsocketDriver: {}", err_7);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 获取群成员资料
     * @param groupId 群号
     * @param memberId 成员 QQ 号
     * @returns Promise<Profile | null>
     */
    WebsocketDriver.prototype.memberProfile = function (groupId, memberId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.command("memberProfile", {
                                target: groupId,
                                memberId: memberId,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 2:
                        err_8 = _a.sent();
                        this.logger.error("memberProfile @ WebsocketDriver: {}", err_8);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 发送好友消息
     * @param friendId 好友 QQ 号
     * @param messageChain 消息内容
     * @param quote 引用的消息 ID
     * @returns Promise<number | boolean> 返回消息标识 ID
     */
    WebsocketDriver.prototype.sendFriendMessage = function (friendId, messageChain, quote) {
        return __awaiter(this, void 0, void 0, function () {
            var processedMessage, response, err_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.processMessageChain(messageChain, types_1.ContextType.FRIEND)];
                    case 1:
                        processedMessage = _a.sent();
                        return [4 /*yield*/, this.command("sendFriendMessage", {
                                target: friendId,
                                messageChain: processedMessage,
                                quote: quote,
                            })];
                    case 2:
                        response = _a.sent();
                        this.eine.dispatch(types_1.EineEventTypeStr.SEND_MESSAGE, {
                            target: sendTarget_1.FriendTarget(friendId),
                            type: types_1.MessageTypeStr.FRIEND_MESSAGE,
                            messageChain: processedMessage,
                        });
                        return [2 /*return*/, response.messageId];
                    case 3:
                        err_9 = _a.sent();
                        this.logger.error("sendFriendMessage @ WebsocketDriver: {}", err_9);
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 发送群消息
     * @param groupId 群号
     * @param messageChain 消息内容
     * @param quote 引用的消息 ID
     * @returns Promise<number | boolean> 返回消息标识 ID
     */
    WebsocketDriver.prototype.sendGroupMessage = function (groupId, messageChain, quote) {
        return __awaiter(this, void 0, void 0, function () {
            var processedMessage, response, err_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.processMessageChain(messageChain, types_1.ContextType.GROUP)];
                    case 1:
                        processedMessage = _a.sent();
                        return [4 /*yield*/, this.command("sendGroupMessage", {
                                target: groupId,
                                messageChain: processedMessage,
                                quote: quote,
                            })];
                    case 2:
                        response = _a.sent();
                        this.eine.dispatch(types_1.EineEventTypeStr.SEND_MESSAGE, {
                            target: sendTarget_1.GroupTarget(groupId),
                            type: types_1.MessageTypeStr.GROUP_MESSAGE,
                            messageChain: processedMessage,
                        });
                        return [2 /*return*/, response.messageId];
                    case 3:
                        err_10 = _a.sent();
                        this.logger.error("sendGroupMessage @ WebsocketDriver: {}", err_10);
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 发送临时消息
     * @param groupId 群号
     * @param memberId 临时会话目标 QQ 号
     * @param messageChain 消息内容
     * @param quote 引用的消息 ID
     * @returns Promise<number | boolean> 返回消息标识 ID
     */
    WebsocketDriver.prototype.sendTempMessage = function (groupId, memberId, messageChain, quote) {
        return __awaiter(this, void 0, void 0, function () {
            var processedMessage, response, err_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.processMessageChain(messageChain, types_1.ContextType.GROUP)];
                    case 1:
                        processedMessage = _a.sent();
                        return [4 /*yield*/, this.command("sendTempMessage", {
                                qq: memberId,
                                group: groupId,
                                messageChain: processedMessage,
                                quote: quote,
                            })];
                    case 2:
                        response = _a.sent();
                        this.eine.dispatch(types_1.EineEventTypeStr.SEND_MESSAGE, {
                            target: sendTarget_1.TempTarget(memberId, groupId),
                            type: types_1.MessageTypeStr.TEMP_MESSAGE,
                            messageChain: processedMessage,
                        });
                        return [2 /*return*/, response.messageId];
                    case 3:
                        err_11 = _a.sent();
                        this.logger.error("sendTempMessage @ WebsocketDriver: {}", err_11);
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 发送戳一戳
     * @param target 要戳谁（QQ 号）？
     * @param subject 在哪发（群号 / QQ 号）？
     * @param kind 好友消息还是群消息？
     * @returns Promise<boolean>
     */
    WebsocketDriver.prototype.sendNudge = function (target, subject, kind) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.command("sendNudge", {
                                target: target,
                                subject: subject,
                                kind: kind,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        err_12 = _a.sent();
                        this.logger.error("sendNudge @ WebsocketDriver: {}", err_12);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 撤回消息
     * @param targetMessageId 撤回消息的 ID
     * @returns Promise<boolean>
     */
    WebsocketDriver.prototype.recall = function (targetMessageId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.command("recall", {
                                target: targetMessageId,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        err_13 = _a.sent();
                        this.logger.error("recall @ WebsocketDriver: {}", err_13);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 删除好友
     * @param friendId 要删除的好友 QQ 号
     * @returns Promise<boolean>
     */
    WebsocketDriver.prototype.deleteFriend = function (friendId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.command("deleteFriend", {
                                target: friendId,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        err_14 = _a.sent();
                        this.logger.error("deleteFriend @ WebsocketDriver: {}", err_14);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 禁言群成员（需要有管理员权限）
     * @param groupId 群号
     * @param memberId 禁言对象 QQ 号
     * @param time 禁言时间，0 秒 ~ 30 天
     * @returns Promise<boolean>
     */
    WebsocketDriver.prototype.mute = function (groupId, memberId, time) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.command("mute", {
                                target: groupId,
                                memberId: memberId,
                                time: Math.max(0, Math.min(2592000, time)),
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        err_15 = _a.sent();
                        this.logger.error("mute @ WebsocketDriver: {}", err_15);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 取消禁言群成员
     * @param groupId 群号
     * @param memberId 取消禁言的群成员 QQ
     * @returns Promise<boolean>
     */
    WebsocketDriver.prototype.unmute = function (groupId, memberId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.command("unmute", {
                                target: groupId,
                                memberId: memberId,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        err_16 = _a.sent();
                        this.logger.error("unmute @ WebsocketDriver: {}", err_16);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 将群成员请出群
     * @param groupId 群号
     * @param memberId 请出群的群成员 QQ
     * @param msg 退群信息
     * @returns Promise<boolean>
     */
    WebsocketDriver.prototype.kick = function (groupId, memberId, msg) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.command("kick", {
                                target: groupId,
                                memberId: memberId,
                                msg: msg,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        err_17 = _a.sent();
                        this.logger.error("kick @ WebsocketDriver: {}", err_17);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * BOT 主动退群
     * @param groupId 群号
     * @returns Promise<boolean>
     */
    WebsocketDriver.prototype.quit = function (groupId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.command("quit", {
                                target: groupId,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        err_18 = _a.sent();
                        this.logger.error("quit @ WebsocketDriver: {}", err_18);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 开启全员禁言
     * @param groupId 群号
     * @returns Promise<boolean>
     */
    WebsocketDriver.prototype.muteAll = function (groupId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_19;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.command("muteAll", {
                                target: groupId,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        err_19 = _a.sent();
                        this.logger.error("muteAll @ WebsocketDriver: {}", err_19);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 关闭全员禁言
     * @param groupId 群号
     * @returns Promise<boolean>
     */
    WebsocketDriver.prototype.unmuteAll = function (groupId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_20;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.command("unmuteAll", {
                                target: groupId,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        err_20 = _a.sent();
                        this.logger.error("unmuteAll @ WebsocketDriver: {}", err_20);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 设置精华信息
     * @param target 消息 messaegeId
     * @returns Promise<boolean>
     */
    WebsocketDriver.prototype.setEssence = function (target) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_21;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.command("setEssence", {
                                target: target,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        err_21 = _a.sent();
                        this.logger.error("setEssence @ WebsocketDriver: {}", err_21);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 获取群资料
     * @param groupId 群号
     * @returns Promise<GroupConfig | null>
     */
    WebsocketDriver.prototype.getGroupConfig = function (groupId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_22;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.command("groupConfig", {
                                target: groupId,
                            }, "get")];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 2:
                        err_22 = _a.sent();
                        this.logger.error("getGroupConfig @ WebsocketDriver: {}", err_22);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 设置/修改群资料
     * @param groupId 群号
     * @param groupConfig 需要修改的群资料字段
     * @returns Promise<boolean>
     */
    WebsocketDriver.prototype.setGroupConfig = function (groupId, groupConfig) {
        return __awaiter(this, void 0, void 0, function () {
            var err_23;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.command("groupConfig", {
                                target: groupId,
                                config: groupConfig,
                            }, "update")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        err_23 = _a.sent();
                        this.logger.error("setGroupConfig @ WebsocketDriver: {}", err_23);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 获取群成员资料
     * @param groupId 群号
     * @param memberId 成员 QQ 号
     * @returns Promise<GroupMember | null>
     */
    WebsocketDriver.prototype.getMemberInfo = function (groupId, memberId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_24;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.command("memberInfo", {
                                target: groupId,
                                memberId: memberId,
                            }, "get")];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 2:
                        err_24 = _a.sent();
                        this.logger.error("getMemberInfo @ WebsocketDriver: {}", err_24);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 设置群成员资料
     * @param groupId 群号
     * @param memberId 成员 QQ 号
     * @param info 成员资料
     * @returns Promise<boolean>
     */
    WebsocketDriver.prototype.setMemberInfo = function (groupId, memberId, info) {
        return __awaiter(this, void 0, void 0, function () {
            var err_25;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.command("memberInfo", {
                                target: groupId,
                                memberId: memberId,
                                info: info,
                            }, "update")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        err_25 = _a.sent();
                        this.logger.error("setMemberInfo @ WebsocketDriver: {}", err_25);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 响应新好友请求
     * @param eventId 事件 ID
     * @param fromId 好友请求来源 QQ 号
     * @param groupId 好友请求来源群组，如果没有则传入 0
     * @param operate 响应操作
     * @param message 回复信息
     * @returns Promise<boolean>
     */
    WebsocketDriver.prototype.respondNewFriendRequest = function (eventId, fromId, groupId, operate, message) {
        if (message === void 0) { message = ""; }
        return __awaiter(this, void 0, void 0, function () {
            var response, err_26;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.command("resp_NewFriendRequestEvent", {
                                eventId: eventId,
                                fromId: fromId,
                                groupId: groupId,
                                operate: operate,
                                message: message,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        err_26 = _a.sent();
                        this.logger.error("respondNewFriendRequest @ WebsocketDriver: {}", err_26);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 响应新成员入群请求
     * @param eventId 事件 ID
     * @param fromId 加群请求成员 QQ 号
     * @param groupId 加群 ID
     * @param opearte 响应操作
     * @param message 回复信息
     * @returns Promise<boolean>
     */
    WebsocketDriver.prototype.respondMemberJoinRequest = function (eventId, fromId, groupId, opearte, message) {
        if (message === void 0) { message = ""; }
        return __awaiter(this, void 0, void 0, function () {
            var response, err_27;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.command("resp_MemberJoinRequestEvent", {
                                eventId: eventId,
                                fromId: fromId,
                                groupId: groupId,
                                opearte: opearte,
                                message: message,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        err_27 = _a.sent();
                        this.logger.error("respondMemberJoinRequest @ WebsocketDriver: {}", err_27);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 响应邀请加群请求
     * @param eventId 事件 ID
     * @param fromId 邀请来源成员 QQ 号
     * @param groupId 邀请群号
     * @param operate 响应操作
     * @param message 恢复信息
     * @returns Promise<boolean>
     */
    WebsocketDriver.prototype.respondInvitedJoinGroupRequest = function (eventId, fromId, groupId, operate, message) {
        if (message === void 0) { message = ""; }
        return __awaiter(this, void 0, void 0, function () {
            var respone, err_28;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.command("resp_BotInvitedJoinGroupRequestEvent", {
                                eventId: eventId,
                                fromId: fromId,
                                groupId: groupId,
                                operate: operate,
                                message: message,
                            })];
                    case 1:
                        respone = _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        err_28 = _a.sent();
                        this.logger.error("respondInvitedJoinGroupRequest @ WebsocketDriver: {}", err_28);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return WebsocketDriver;
}());
exports.default = WebsocketDriver;
//# sourceMappingURL=WebsocketDriver.js.map