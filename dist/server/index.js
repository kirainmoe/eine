"use strict";
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
var chalk_1 = __importDefault(require("chalk"));
var path_1 = __importDefault(require("path"));
var express_1 = __importDefault(require("express"));
var express_ws_1 = __importDefault(require("express-ws"));
var cors_1 = __importDefault(require("cors"));
var crypto_1 = require("crypto");
var types_1 = require("../common/types");
var routes_1 = require("./routes");
var EineServer = /** @class */ (function () {
    function EineServer(eine) {
        this.magicToken = "";
        this.expireTime = 0;
        this.eine = eine;
        this.db = eine.db;
        this.logger = eine.logger;
        this.serverConfig = this.eine.getOption("server");
        // 实例化 Express
        this.app = express_1.default();
        // 添加 websocket 支持
        express_ws_1.default(this.app);
        // body-parser 中间件
        this.app.use(express_1.default.text());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.raw());
        // 访问日志中间件
        this.app.use(this.logRequestMiddleware.bind(this));
        // 错误处理中间件
        this.app.use(this.errorHandlerMiddleware.bind(this));
        // 跨域中间件
        if (this.serverConfig.cors) {
            this.app.use(cors_1.default({ origin: this.serverConfig.cors }));
        }
        // 设置静态目录
        this.app.use(express_1.default.static(path_1.default.join(__dirname, "build")));
        // 注册路由
        this.registerRouters();
    }
    /** 启动服务器 */
    EineServer.prototype.startServer = function () {
        var _this = this;
        var _a = this.serverConfig, port = _a.port, host = _a.host;
        return new Promise(function (resolve, reject) {
            _this.app.listen(port, host, function () {
                _this.logger.info("{}{}", chalk_1.default.magenta("Eine admin server is running on "), chalk_1.default.cyan("http://" + host + ":" + port));
                _this.eine.dispatch(types_1.EineEventTypeStr.AFTER_SERVER_START, null);
                resolve(null);
            });
        });
    };
    /** 注册路由 */
    EineServer.prototype.registerRouters = function () {
        var _this = this;
        var wrapRouter = function (handler) {
            return function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, handler({
                                req: req,
                                res: res,
                                eine: this.eine,
                                logger: this.logger,
                                db: this.db,
                                server: this,
                            })];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); };
        };
        var wrapWsRouter = function (handler) {
            return function (ws, req, res) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, handler({
                                req: req,
                                res: res,
                                ws: ws,
                                eine: this.eine,
                                logger: this.logger,
                                db: this.db,
                                server: this,
                            })];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); };
        };
        var sendHtmlDirectly = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var isInstalled;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.countUser({ role: 0 })];
                    case 1:
                        isInstalled = _a.sent();
                        if (isInstalled <= 0) {
                            return [2 /*return*/, res.redirect("/install")];
                        }
                        res.sendFile(path_1.default.join(__dirname, "build", "index.html"));
                        return [2 /*return*/];
                }
            });
        }); };
        this.app.post("/api/login", routes_1.api.login.validator, wrapRouter(routes_1.api.login.handler));
        this.app.post("/api/install", routes_1.api.install.validator, wrapRouter(routes_1.api.install.handler));
        this.app.post("/api/send_text", routes_1.api.sendText.validator, wrapRouter(routes_1.api.sendText.handler));
        this.app.get("/api/account_info", routes_1.api.accountInfo.validator, wrapRouter(routes_1.api.accountInfo.handler));
        this.app.get("/api/public_info", routes_1.api.publicInfo.validator, wrapRouter(routes_1.api.publicInfo.handler));
        this.app.get("/api/group_info", routes_1.api.groupInfo.validator, wrapRouter(routes_1.api.groupInfo.handler));
        this.app.get("/api/refresh_magic_token", routes_1.api.magic.validator, wrapRouter(routes_1.api.magic.handler));
        this.app.get("/install", routes_1.panel.install.validator, wrapRouter(routes_1.panel.install.handler));
        this.app.get("/login", sendHtmlDirectly);
        this.app.get("/panel/:path", sendHtmlDirectly);
        this.app.get("/", sendHtmlDirectly);
        this.app.ws('/ws', wrapWsRouter(routes_1.ws.default));
        // 注册 websocket 推送事件
        this.eine.on('Message')(routes_1.ws.pushMessage);
    };
    EineServer.prototype.logRequestMiddleware = function (req, res, next) {
        var _this = this;
        var end = res.end;
        res.end = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _this.logger.verbose("{} {} -> {}", req.method, req.path, res.statusCode >= 400
                ? chalk_1.default.red(res.statusCode)
                : res.statusCode >= 300
                    ? chalk_1.default.yellow(res.statusCode)
                    : chalk_1.default.green(res.statusCode));
            res.end = end;
            res.end.apply(res, args);
        };
        next();
    };
    EineServer.prototype.errorHandlerMiddleware = function (err, req, res, next) {
        this.logger.error("{} {} -> {}, detail: ", req.method, req.url, chalk_1.default.red(500), err);
        console.error(chalk_1.default.red(err.stack));
        res.status(500).send({
            code: 500,
            stauts: "failed",
            message: "internal server error",
        });
    };
    EineServer.prototype.compareMagicToken = function (token) {
        return (+new Date() > this.expireTime) ? false : this.magicToken === token;
    };
    EineServer.prototype.ensureInstalled = function (res) {
        return __awaiter(this, void 0, void 0, function () {
            var userCount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.countUser({ role: 0 })];
                    case 1:
                        userCount = _a.sent();
                        if (userCount === 0)
                            return [2 /*return*/, res.redirect("/ui/install")];
                        return [2 /*return*/];
                }
            });
        });
    };
    /** 生成特殊用途的 magic token */
    EineServer.prototype.generateMagicToken = function () {
        var _this = this;
        var charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz";
        var randomStr = function (length) {
            return new Array(length)
                .fill(null)
                .map(function () { return charset.charAt(crypto_1.randomInt(charset.length)); })
                .join("");
        };
        this.magicToken = randomStr(10);
        this.expireTime = +new Date() + 1000 * 60 * 5;
        this.logger.essentialInfo("Server magic token: {} . This will be expired in 5 mins.", chalk_1.default.green(this.magicToken));
        setTimeout(function () { return _this.expireMagicToken(); }, 5 * 60 * 1000);
        return this.magicToken;
    };
    /** 使 magic token 失效 */
    EineServer.prototype.expireMagicToken = function () {
        this.magicToken = "";
        this.expireTime = 0;
    };
    return EineServer;
}());
exports.default = EineServer;
//# sourceMappingURL=index.js.map