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
var fs_1 = require("fs");
var form_data_1 = __importDefault(require("form-data"));
var types_1 = require("../../common/types");
var MessageComponentType_1 = require("../../common/types/MessageComponentType");
var request_1 = require("../../utils/request");
var types_2 = require("./types");
var sendTarget_1 = require("../../common/sendTarget");
var component_1 = require("../../common/component");
/**
 * mirai-api-http: Http Adapter Driver
 */
var HttpDriver = /** @class */ (function () {
    function HttpDriver(options, parent) {
        this._pollingInterval = undefined;
        this.options = options;
        this.eine = parent;
        this._logger = parent.logger;
        var host = options.host, port = options.port;
        this.apiHost =
            host.startsWith("http://") || host.startsWith("https://") ? host + ":" + port : "http://" + host + ":" + port;
        this._session = "";
        this._sessionState = types_2.HttpSessionState.IDLE;
        this.logger.verbose("HttpDriver: baseUrl = {}", this.apiHost);
    }
    Object.defineProperty(HttpDriver.prototype, "logger", {
        get: function () {
            return this._logger;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HttpDriver.prototype, "session", {
        /** sessionKey */
        get: function () {
            return this._session;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HttpDriver.prototype, "sessionState", {
        /** 会话状态 */
        get: function () {
            return this._sessionState;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * 拼接 API 请求地址
     * @param path 请求 API 的路径
     * @returns 返回请求地址
     */
    HttpDriver.prototype.api = function (path) {
        return this.apiHost + "/" + path;
    };
    /**
     * 设置实例身份（QQ 号）
     * @param qq
     */
    HttpDriver.prototype.setIdentity = function (qq) {
        this.options.qq = qq;
    };
    HttpDriver.prototype.startPollingMessage = function (interval) {
        var _this = this;
        this._pollingInterval = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
            var messages;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetchMessage()];
                    case 1:
                        messages = _a.sent();
                        this.eine.resolveMessageAndEvent(messages);
                        return [2 /*return*/];
                }
            });
        }); }, interval);
    };
    HttpDriver.prototype.stopPollingMessage = function () {
        this._pollingInterval && clearInterval(this._pollingInterval);
    };
    /**
     * 会话认证流程
     * @returns Promise<string>
     */
    HttpDriver.prototype.verify = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.options.enableVerify) {
                            this.logger.verbose("verify @ HttpDriver: verify is disabled, skipping.");
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, request_1.wrappedPost(this.api("verify"), {
                                verifyKey: this.options.verifyKey,
                            })];
                    case 2:
                        response = _a.sent();
                        this._session = response.payload.session;
                        this._sessionState = types_2.HttpSessionState.VERIFIED;
                        this.logger.verbose("HttpDriver: successfully verified, current session is {}", this.session);
                        this.eine.dispatch(types_1.EineEventTypeStr.AFTER_HTTP_VERIFY, this.session);
                        return [2 /*return*/, this.session];
                    case 3:
                        err_1 = _a.sent();
                        this.logger.error("verify @ HttpDriver, {}", err_1);
                        throw new Error(err_1);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 会话与账号身份绑定流程
     * @returns Promise<boolean>
     */
    HttpDriver.prototype.bind = function () {
        return __awaiter(this, void 0, void 0, function () {
            var err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.options.singleMode) {
                            this.logger.verbose("bind @ HttpDriver: single mode is enabled, skipping.");
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, request_1.wrappedPost(this.api("bind"), {
                                sessionKey: this.session,
                                qq: this.options.qq,
                            })];
                    case 2:
                        _a.sent();
                        this.logger.verbose("HttpDriver: session {} successfully binded with QQ: {}", this.session, this.options.qq);
                        this.eine.dispatch(types_1.EineEventTypeStr.AFTER_HTTP_BIND, null);
                        return [2 /*return*/, true];
                    case 3:
                        err_2 = _a.sent();
                        this.logger.error("bind @ HttpDriver, {}", err_2);
                        throw new Error(err_2);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 结束会话
     * @returns Promise<boolean>
     */
    HttpDriver.prototype.release = function () {
        return __awaiter(this, void 0, void 0, function () {
            var err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.options.enableVerify) {
                            this.logger.verbose("release @ HttpDriver: verify is disabled, skipping.");
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, request_1.wrappedPost(this.api("release"), {
                                sessionKey: this.session,
                                qq: this.options.qq,
                            })];
                    case 2:
                        _a.sent();
                        this.logger.verbose("Session {} successfully released.", this.session);
                        this._session = "";
                        this._sessionState = types_2.HttpSessionState.IDLE;
                        // todo: trigger `released`, `httpReleased` event
                        return [2 /*return*/, true];
                    case 3:
                        err_3 = _a.sent();
                        this.logger.error("release @ HttpDriver, {}", err_3);
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 获取未读缓存消息的数量
     * @returns Promise<number>
     */
    HttpDriver.prototype.countMessage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, request_1.wrappedGet(this.api("countMessage"), { sessionKey: this.session })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 2:
                        err_4 = _a.sent();
                        this.logger.error("countMessage @ HttpDriver, {}", err_4);
                        return [2 /*return*/, 0];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 按时间顺序获取消息并从消息队列中移除
     * @returns Promise<MessageEventType[]>
     */
    HttpDriver.prototype.fetchMessage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, request_1.wrappedGet(this.api("fetchMessage"), {
                                sessionKey: this.session,
                                count: 10,
                            })];
                    case 1: return [2 /*return*/, (_a.sent()).data];
                    case 2:
                        err_5 = _a.sent();
                        this.logger.error("fetchMessage @ HttpDriver, {}", err_5);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 获取插件版本
     */
    HttpDriver.prototype.about = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, request_1.wrappedGet(this.api("about"), {})];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 2:
                        err_6 = _a.sent();
                        this.logger.error("about @ HttpDriver, {}", err_6);
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
    HttpDriver.prototype.messageFromId = function (messageId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, request_1.wrappedGet(this.api("messageFromId"), {
                                sessionKey: this.session,
                                id: messageId,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 2:
                        err_7 = _a.sent();
                        this.logger.error("messageFromId @ HttpDriver: {}", err_7);
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
    HttpDriver.prototype.friendList = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, request_1.wrappedGet(this.api("friendList"), {
                                sessionKey: this.session,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 2:
                        err_8 = _a.sent();
                        this.logger.error("friendList @ HttpDriver: {}", err_8);
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
    HttpDriver.prototype.groupList = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, request_1.wrappedGet(this.api("groupList"), {
                                sessionKey: this.session,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 2:
                        err_9 = _a.sent();
                        this.logger.error("groupList @ HttpDriver: {}", err_9);
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
    HttpDriver.prototype.memberList = function (groupId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, request_1.wrappedGet(this.api("memberList"), {
                                sessionKey: this.session,
                                target: groupId,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 2:
                        err_10 = _a.sent();
                        this.logger.error("memberList @ HttpDriver: {}", err_10);
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
    HttpDriver.prototype.botProfile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, request_1.wrappedGet(this.api("botProfile"), { sessionKey: this.session })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.payload];
                    case 2:
                        err_11 = _a.sent();
                        this.logger.error("botProfile @ HttpDriver: {}", err_11);
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
    HttpDriver.prototype.friendProfile = function (friendId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, request_1.wrappedGet(this.api("friendProfile"), {
                                sessionKey: this.session,
                                target: friendId,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.payload];
                    case 2:
                        err_12 = _a.sent();
                        this.logger.error("friendProfile @ HttpDriver: {}", err_12);
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
    HttpDriver.prototype.memberProfile = function (groupId, memberId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, request_1.wrappedGet(this.api("memberProfile"), {
                                sessionKey: this.session,
                                target: groupId,
                                memberId: memberId,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.payload];
                    case 2:
                        err_13 = _a.sent();
                        this.logger.error("memberProfile @ HttpDriver: {}", err_13);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 上传图片
     * @param target
     * @param type
     * @returns Promise
     */
    HttpDriver.prototype.uploadImage = function (target, type) {
        return __awaiter(this, void 0, void 0, function () {
            var file, form, response, err_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        file = typeof target === "string"
                            ? fs_1.createReadStream(target)
                            : typeof target.file === "string"
                                ? fs_1.createReadStream(target.file)
                                : target.file;
                        form = new form_data_1.default();
                        form.append("sessionKey", this.session);
                        form.append("type", type);
                        form.append("img", file, file instanceof Buffer ? { filename: "payload.jpg" } : undefined);
                        return [4 /*yield*/, request_1.upload(this.api("uploadImage"), form)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                imageId: response.data.imageId,
                                url: response.data.url,
                            }];
                    case 2:
                        err_14 = _a.sent();
                        this.logger.error("uploadImage @ HttpDriver: Cannot upload image file from {}, {}", typeof target === "string" ? target : target.file, err_14);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 上传语音文件
     * @param target
     * @param type
     * @returns Promise
     */
    HttpDriver.prototype.uploadVoice = function (target, type) {
        return __awaiter(this, void 0, void 0, function () {
            var file, form, response, err_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        file = typeof target === "string"
                            ? fs_1.createReadStream(target)
                            : typeof target.file === "string"
                                ? fs_1.createReadStream(target.file)
                                : target.file;
                        form = new form_data_1.default();
                        form.append("sessionKey", this.session);
                        form.append("type", type);
                        form.append("voice", file, file instanceof Buffer ? { filename: "payload.amr" } : undefined);
                        return [4 /*yield*/, request_1.upload(this.api("uploadVoice"), form)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                voiceId: response.data.voiceId,
                                url: response.data.url,
                            }];
                    case 2:
                        err_15 = _a.sent();
                        this.logger.error("uploadVoice @ HttpDriver: Cannot upload voice file from {}, {}", typeof target === "string" ? target : target.file, err_15);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 上传群文件
     * @param target 目标文件，路径或使用 File.from(string | Buffer | ReadStream) 构造
     * @param type 上传类型，目前只支持 group
     * @param path 上传目录，空为根目录
     * @returns Promise
     */
    HttpDriver.prototype.uploadFile = function (target, type, path) {
        if (path === void 0) { path = ""; }
        return __awaiter(this, void 0, void 0, function () {
            var file, form, response, err_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        file = typeof target === "string"
                            ? fs_1.createReadStream(target)
                            : typeof target.file === "string"
                                ? fs_1.createReadStream(target.file)
                                : target.file;
                        form = new form_data_1.default();
                        form.append("sessionKey", this.session);
                        form.append("type", "group");
                        form.append("path", path);
                        form.append("file", file);
                        return [4 /*yield*/, request_1.upload(this.api("file/upload"), form)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, null];
                    case 2:
                        err_16 = _a.sent();
                        this.logger.error("uploadFile @ HttpDriver: Cannot upload file from {}, {}", typeof target === "string" ? target : target.file, err_16);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 处理待发送的信息，如上传未上传的图片等
     * @param messageChain 消息链
     * @param type 发送的信息类别
     * @returns MessageChain 处理后的消息链
     */
    HttpDriver.prototype.processMessageChain = function (messageChain, type) {
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
                        if (!(typeof component === 'string')) return [3 /*break*/, 2];
                        processed.push(component_1.Plain(component));
                        return [3 /*break*/, 5];
                    case 2:
                        if (!(component.type === MessageComponentType_1.MessageComponentTypeStr.PRELOAD)) return [3 /*break*/, 4];
                        pendingFile = component;
                        return [4 /*yield*/, (pendingFile.originType === MessageComponentType_1.MessageComponentTypeStr.VOICE
                                ? this.uploadVoice(pendingFile, type)
                                : this.uploadImage(pendingFile, type))];
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
     * 发送好友消息
     * @param friendId 好友 QQ 号
     * @param messageChain 消息内容
     * @param quote 引用的消息 ID
     * @returns Promise<number | boolean> 返回消息标识 ID
     */
    HttpDriver.prototype.sendFriendMessage = function (friendId, messageChain, quote) {
        return __awaiter(this, void 0, void 0, function () {
            var processedMessage, response, err_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.processMessageChain(messageChain, types_1.ContextType.FRIEND)];
                    case 1:
                        processedMessage = _a.sent();
                        return [4 /*yield*/, request_1.wrappedPost(this.api("sendFriendMessage"), {
                                sessionKey: this.session,
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
                        return [2 /*return*/, response.payload.messageId];
                    case 3:
                        err_17 = _a.sent();
                        this.logger.error("sendFriendMessage @ HttpDriver: {}", err_17);
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
    HttpDriver.prototype.sendGroupMessage = function (groupId, messageChain, quote) {
        return __awaiter(this, void 0, void 0, function () {
            var processedMessage, response, err_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.processMessageChain(messageChain, types_1.ContextType.GROUP)];
                    case 1:
                        processedMessage = _a.sent();
                        return [4 /*yield*/, request_1.wrappedPost(this.api("sendGroupMessage"), {
                                sessionKey: this.session,
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
                        return [2 /*return*/, response.payload.messageId];
                    case 3:
                        err_18 = _a.sent();
                        this.logger.error("sendGroupMessage @ HttpDriver: {}", err_18);
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
    HttpDriver.prototype.sendTempMessage = function (groupId, memberId, messageChain, quote) {
        return __awaiter(this, void 0, void 0, function () {
            var processedMessage, response, err_19;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.processMessageChain(messageChain, types_1.ContextType.GROUP)];
                    case 1:
                        processedMessage = _a.sent();
                        return [4 /*yield*/, request_1.wrappedPost(this.api("sendTempMessage"), {
                                sessionKey: this.session,
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
                        return [2 /*return*/, response.payload.messageId];
                    case 3:
                        err_19 = _a.sent();
                        this.logger.error("sendTempMessage @ HttpDriver: {}", err_19);
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
    HttpDriver.prototype.sendNudge = function (target, subject, kind) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_20;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, request_1.wrappedPost(this.api("sendNudge"), {
                                sessionKey: this.session,
                                target: target,
                                subject: subject,
                                kind: kind,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        err_20 = _a.sent();
                        this.logger.error("sendNudge @ HttpDriver: {}", err_20);
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
    HttpDriver.prototype.recall = function (targetMessageId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_21;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, request_1.wrappedPost(this.api("recall"), {
                                sessionKey: this.session,
                                target: targetMessageId,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        err_21 = _a.sent();
                        this.logger.error("recall @ HttpDriver: {}", err_21);
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
    HttpDriver.prototype.deleteFriend = function (friendId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_22;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, request_1.wrappedPost(this.api("deleteFriend"), {
                                sessionKey: this.session,
                                target: friendId,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        err_22 = _a.sent();
                        this.logger.error("deleteFriend @ HttpDriver: {}", err_22);
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
    HttpDriver.prototype.mute = function (groupId, memberId, time) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_23;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, request_1.wrappedPost(this.api("mute"), {
                                sessionKey: this.session,
                                target: groupId,
                                memberId: memberId,
                                time: Math.max(0, Math.min(2592000, time)),
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        err_23 = _a.sent();
                        this.logger.error("mute @ HttpDriver: {}", err_23);
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
    HttpDriver.prototype.unmute = function (groupId, memberId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_24;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, request_1.wrappedPost(this.api("unmute"), {
                                sessionKey: this.session,
                                target: groupId,
                                memberId: memberId,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        err_24 = _a.sent();
                        this.logger.error("unmute @ HttpDriver: {}", err_24);
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
    HttpDriver.prototype.kick = function (groupId, memberId, msg) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_25;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, request_1.wrappedPost(this.api("kick"), {
                                sessionKey: this.session,
                                target: groupId,
                                memberId: memberId,
                                msg: msg,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        err_25 = _a.sent();
                        this.logger.error("kick @ HttpDriver: {}", err_25);
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
    HttpDriver.prototype.quit = function (groupId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_26;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, request_1.wrappedPost(this.api("quit"), {
                                sessionKey: this.session,
                                target: groupId,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        err_26 = _a.sent();
                        this.logger.error("quit @ HttpDriver: {}", err_26);
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
    HttpDriver.prototype.muteAll = function (groupId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_27;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, request_1.wrappedPost(this.api("muteAll"), {
                                sessionKey: this.session,
                                target: groupId,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        err_27 = _a.sent();
                        this.logger.error("muteAll @ HttpDriver: {}", err_27);
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
    HttpDriver.prototype.unmuteAll = function (groupId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_28;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, request_1.wrappedPost(this.api("unmuteAll"), {
                                sessionKey: this.session,
                                target: groupId,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        err_28 = _a.sent();
                        this.logger.error("unmuteAll @ HttpDriver: {}", err_28);
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
    HttpDriver.prototype.setEssence = function (target) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_29;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, request_1.wrappedPost(this.api("setEssence"), {
                                sessionKey: this.session,
                                target: target,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        err_29 = _a.sent();
                        this.logger.error("setEssence @ HttpDriver: {}", err_29);
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
    HttpDriver.prototype.getGroupConfig = function (groupId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_30;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, request_1.wrappedGet(this.api("groupConfig"), {
                                sessionKey: this.session,
                                target: groupId,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.payload];
                    case 2:
                        err_30 = _a.sent();
                        this.logger.error("getGroupConfig @ HttpDriver: {}", err_30);
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
    HttpDriver.prototype.setGroupConfig = function (groupId, groupConfig) {
        return __awaiter(this, void 0, void 0, function () {
            var err_31;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, request_1.wrappedPost(this.api("groupConfig"), {
                                sessionKey: this.session,
                                target: groupId,
                                config: groupConfig,
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        err_31 = _a.sent();
                        this.logger.error("setGroupConfig @ HttpDriver: {}", err_31);
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
    HttpDriver.prototype.getMemberInfo = function (groupId, memberId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_32;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, request_1.wrappedGet(this.api("memberInfo"), {
                                sessionKey: this.session,
                                target: groupId,
                                memberId: memberId,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.payload];
                    case 2:
                        err_32 = _a.sent();
                        this.logger.error("getMemberInfo @ HttpDriver: {}", err_32);
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
    HttpDriver.prototype.setMemberInfo = function (groupId, memberId, info) {
        return __awaiter(this, void 0, void 0, function () {
            var err_33;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, request_1.wrappedPost(this.api("memberInfo"), {
                                sessionKey: this.session,
                                target: groupId,
                                memberId: memberId,
                                info: info,
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        err_33 = _a.sent();
                        this.logger.error("setMemberInfo @ HttpDriver: {}", err_33);
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
    HttpDriver.prototype.respondNewFriendRequest = function (eventId, fromId, groupId, operate, message) {
        if (message === void 0) { message = ""; }
        return __awaiter(this, void 0, void 0, function () {
            var response, err_34;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, request_1.wrappedPost(this.api("resp/newFriendRequestEvent"), {
                                sessionKey: this.session,
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
                        err_34 = _a.sent();
                        this.logger.error("respondNewFriendRequest @ HttpDriver: {}", err_34);
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
    HttpDriver.prototype.respondMemberJoinRequest = function (eventId, fromId, groupId, opearte, message) {
        if (message === void 0) { message = ""; }
        return __awaiter(this, void 0, void 0, function () {
            var response, err_35;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, request_1.wrappedPost(this.api("resp/memberJoinRequestEvent"), {
                                sessionKey: this.session,
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
                        err_35 = _a.sent();
                        this.logger.error("respondMemberJoinRequest @ HttpDriver: {}", err_35);
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
    HttpDriver.prototype.respondInvitedJoinGroupRequest = function (eventId, fromId, groupId, operate, message) {
        if (message === void 0) { message = ""; }
        return __awaiter(this, void 0, void 0, function () {
            var respone, err_36;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, request_1.wrappedPost(this.api("resp/botInvitedJoinGroupRequestEvent"), {
                                sessionKey: this.session,
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
                        err_36 = _a.sent();
                        this.logger.error("respondInvitedJoinGroupRequest @ HttpDriver: {}", err_36);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return HttpDriver;
}());
exports.default = HttpDriver;
//# sourceMappingURL=HttpDriver.js.map