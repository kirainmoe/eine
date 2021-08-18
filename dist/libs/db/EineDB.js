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
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = require("crypto");
var mongodb_1 = require("mongodb");
var types_1 = require("../../common/types");
var EineDB = /** @class */ (function () {
    function EineDB(config, eine) {
        this.botId = -1;
        this.db = null;
        this.isConnected = false;
        this.config = __assign({ host: "localhost", port: 27017, username: "", password: "", dbName: "eine_defualt_db" }, config);
        this.eine = eine;
        this.logger = eine.logger;
        this.botId = eine.getOption("qq");
        var _a = this.config, host = _a.host, port = _a.port, username = _a.username, password = _a.password;
        this.mongoUrl = "mongodb://" + (username.length ? "" + username + (password.length ? ":" + password : "") + "@" : "") + host + ":" + port;
        this.client = new mongodb_1.MongoClient(this.mongoUrl);
    }
    EineDB.prototype.ensureDatabaseConnected = function () {
        if (!this.isConnected || !this.db) {
            this.logger.error("EineDB: MongoDB is not connected. Cannot call any MongoDB method at this time.");
            throw new Error("MongoDB is not connected. Cannot call any DB method at this time.");
        }
    };
    EineDB.prototype.getCollectionKey = function (type, sender, target) {
        var botId = this.botId;
        var temp = sender.myself ? target : sender;
        var collectionKey;
        switch (type) {
            case types_1.MessageTypeStr.FRIEND_MESSAGE:
                collectionKey = botId + "-friend-" + temp.id;
                break;
            case types_1.MessageTypeStr.GROUP_MESSAGE:
                collectionKey = botId + "-group-" + temp.group.id;
                break;
            case types_1.MessageTypeStr.TEMP_MESSAGE:
                collectionKey = botId + "-temp-" + temp.id;
                break;
            case types_1.MessageTypeStr.STRANGER_MESSAGE:
                collectionKey = botId + "-stranger-" + temp.id;
                break;
            default:
                collectionKey = botId + "-" + type;
                break;
        }
        return collectionKey;
    };
    EineDB.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, host, port, username, password, logMongoUrl;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.logger.verbose("EineDB: establishing connection with MongoDB..");
                        return [4 /*yield*/, this.client.connect()];
                    case 1:
                        _b.sent();
                        this.db = this.client.db(this.config.dbName);
                        _a = this.config, host = _a.host, port = _a.port, username = _a.username, password = _a.password;
                        logMongoUrl = "mongodb://" + (username.length ? "" + username + (password.length ? ":******" : "") + "@" : "") + host + ":" + port;
                        this.logger.verbose("EineDB: connected to MongoDB: {}", logMongoUrl);
                        this.isConnected = true;
                        this.eine.dispatch(types_1.EineEventTypeStr.AFTER_MONGO_CONNECTED, {
                            instance: this,
                            client: this.client,
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    EineDB.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.close()];
                    case 1:
                        _a.sent();
                        this.isConnected = false;
                        this.eine.dispatch(types_1.EineEventTypeStr.AFTER_MONGO_CLOSE, null);
                        return [2 /*return*/];
                }
            });
        });
    };
    EineDB.prototype.saveIncomingMessage = function (type, sender, target, messageChain) {
        return __awaiter(this, void 0, void 0, function () {
            var collectionKey, collection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.ensureDatabaseConnected();
                        collectionKey = this.getCollectionKey(type, sender, target);
                        collection = this.db.collection(collectionKey);
                        return [4 /*yield*/, collection.insertMany([
                                {
                                    messageChain: messageChain,
                                    sender: sender,
                                    target: target,
                                    time: +new Date(),
                                    type: "incoming",
                                },
                            ])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EineDB.prototype.saveOutgoingMessage = function (type, sender, target, messageChain) {
        return __awaiter(this, void 0, void 0, function () {
            var collectionKey, collection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.ensureDatabaseConnected();
                        collectionKey = this.getCollectionKey(type, sender, target);
                        collection = this.db.collection(collectionKey);
                        return [4 /*yield*/, collection.insertMany([
                                {
                                    messageChain: messageChain,
                                    sender: sender,
                                    target: target,
                                    time: +new Date(),
                                    type: "incoming",
                                },
                            ])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EineDB.prototype.findMessage = function (type, sourceOrDestination, direction, filterCond) {
        if (filterCond === void 0) { filterCond = {}; }
        this.ensureDatabaseConnected();
        var collectionKey = this.getCollectionKey(type, sourceOrDestination);
        var collection = this.db.collection(collectionKey);
        return collection.find(__assign({ type: direction }, filterCond));
    };
    EineDB.prototype.dropMessage = function (type, sourceOrDestination) {
        return __awaiter(this, void 0, void 0, function () {
            var collectionKey, collection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.ensureDatabaseConnected();
                        collectionKey = this.getCollectionKey(type, sourceOrDestination);
                        collection = this.db.collection(collectionKey);
                        return [4 /*yield*/, collection.drop()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // 用户相关：统计、鉴权、登录、注册
    /**
     * 统计符合条件的用户数量
     * @param filter 条件
     * @returns Promise<number>
     */
    EineDB.prototype.countUser = function (filter) {
        if (filter === void 0) { filter = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.ensureDatabaseConnected();
                return [2 /*return*/, this.db.collection("user").find(filter).count()];
            });
        });
    };
    EineDB.prototype.login = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var passwordHash, users, token, userArray, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        passwordHash = this.md5(password);
                        users = this.db.collection("user").find({
                            username: username,
                            password: passwordHash,
                        });
                        return [4 /*yield*/, users.count()];
                    case 1:
                        if ((_a.sent()) <= 0)
                            return [2 /*return*/, false];
                        token = this.md5(username + "-" + password + "-" + +new Date() * Math.random());
                        return [4 /*yield*/, users.toArray()];
                    case 2:
                        userArray = _a.sent();
                        return [4 /*yield*/, this.updateAuthToken(userArray[0].uid, token)];
                    case 3:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    EineDB.prototype.expiresOutdatedAuthToken = function (uid) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.collection("authorization").deleteMany({
                            expire: { $lte: +new Date() }
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EineDB.prototype.updateAuthToken = function (uid, authToken) {
        return __awaiter(this, void 0, void 0, function () {
            var expire, payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expire = +new Date() + 15 * 86400000 // 15 days;
                        ;
                        payload = {
                            uid: uid,
                            authToken: authToken,
                            expire: expire
                        };
                        return [4 /*yield*/, this.expiresOutdatedAuthToken(uid)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.db.collection("authorization").insertOne(payload)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, payload];
                }
            });
        });
    };
    EineDB.prototype.authenticate = function (uid, authToken) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.expiresOutdatedAuthToken(uid)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.db.collection("authorization").find({
                                uid: uid,
                                authToken: authToken,
                                expire: { $gt: +new Date() }
                            }).count()];
                    case 2: return [2 /*return*/, (_a.sent()) >= 0];
                }
            });
        });
    };
    /**
     * 创建用户
     * @param username 用户名
     * @param password 密码
     * @param role 角色
     * @returns Promise
     */
    EineDB.prototype.createUser = function (username, password, role) {
        return __awaiter(this, void 0, void 0, function () {
            var userCount, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.ensureDatabaseConnected();
                        return [4 /*yield*/, this.countUser()];
                    case 1:
                        userCount = _a.sent();
                        return [4 /*yield*/, this.db.collection("user").insertMany([{
                                    uid: userCount + 1,
                                    username: username,
                                    password: this.md5(password),
                                    role: role,
                                }])];
                    case 2:
                        result = _a.sent();
                        this.logger.info("user created: username={}, role={}", username, role);
                        return [2 /*return*/, {
                                uid: userCount + 1,
                                payload: result,
                            }];
                }
            });
        });
    };
    EineDB.prototype.md5 = function (target) {
        var hash = crypto_1.createHash('md5').update(target).digest('hex');
        return hash;
    };
    return EineDB;
}());
exports.default = EineDB;
//# sourceMappingURL=EineDB.js.map