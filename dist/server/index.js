"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const express_ws_1 = __importDefault(require("express-ws"));
const cors_1 = __importDefault(require("cors"));
const crypto_1 = require("crypto");
const types_1 = require("../common/types");
const routes_1 = require("./routes");
class EineServer {
    eine;
    db;
    logger;
    serverConfig;
    app;
    magicToken = "";
    expireTime = 0;
    constructor(eine) {
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
    startServer() {
        const { port, host } = this.serverConfig;
        return new Promise((resolve, reject) => {
            this.app.listen(port, host, () => {
                this.logger.info("{}{}", chalk_1.default.magenta("Eine admin server is running on "), chalk_1.default.cyan(`http://${host}:${port}`));
                this.eine.dispatch(types_1.EineEventTypeStr.AFTER_SERVER_START, null);
                resolve(null);
            });
        });
    }
    /** 注册路由 */
    registerRouters() {
        const wrapRouter = (handler) => {
            return async (req, res) => await handler({
                req,
                res,
                eine: this.eine,
                logger: this.logger,
                db: this.db,
                server: this,
            });
        };
        const wrapWsRouter = (handler) => {
            return async (ws, req, res) => await handler({
                req,
                res,
                ws,
                eine: this.eine,
                logger: this.logger,
                db: this.db,
                server: this,
            });
        };
        const sendHtmlDirectly = async (req, res) => {
            const isInstalled = await this.db.countUser({ role: 0 });
            if (isInstalled <= 0) {
                return res.redirect("/install");
            }
            res.sendFile(path_1.default.join(__dirname, "build", "index.html"));
        };
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
    }
    logRequestMiddleware(req, res, next) {
        const end = res.end;
        res.end = (...args) => {
            this.logger.verbose("{} {} -> {}", req.method, req.path, res.statusCode >= 400
                ? chalk_1.default.red(res.statusCode)
                : res.statusCode >= 300
                    ? chalk_1.default.yellow(res.statusCode)
                    : chalk_1.default.green(res.statusCode));
            res.end = end;
            res.end(...args);
        };
        next();
    }
    errorHandlerMiddleware(err, req, res, next) {
        this.logger.error("{} {} -> {}, detail: ", req.method, req.url, chalk_1.default.red(500), err);
        console.error(chalk_1.default.red(err.stack));
        res.status(500).send({
            code: 500,
            stauts: "failed",
            message: "internal server error",
        });
    }
    compareMagicToken(token) {
        return (+new Date() > this.expireTime) ? false : this.magicToken === token;
    }
    async ensureInstalled(res) {
        const userCount = await this.db.countUser({ role: 0 });
        if (userCount === 0)
            return res.redirect("/ui/install");
    }
    /** 生成特殊用途的 magic token */
    generateMagicToken() {
        const charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz";
        const randomStr = (length) => new Array(length)
            .fill(null)
            .map(() => charset.charAt(crypto_1.randomInt(charset.length)))
            .join("");
        this.magicToken = randomStr(10);
        this.expireTime = +new Date() + 1000 * 60 * 5;
        this.logger.essentialInfo("Server magic token: {} . This will be expired in 5 mins.", chalk_1.default.green(this.magicToken));
        setTimeout(() => this.expireMagicToken(), 5 * 60 * 1000);
        return this.magicToken;
    }
    /** 使 magic token 失效 */
    expireMagicToken() {
        this.magicToken = "";
        this.expireTime = 0;
    }
}
exports.default = EineServer;
//# sourceMappingURL=index.js.map