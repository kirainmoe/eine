import chalk from "chalk";

import path from "path";

import express, {Express, Request, Response} from "express";
import expressWs from "express-ws";
import cors from "cors";
import * as Websocket from "ws";
import { randomInt } from "crypto";

import Eine from "..";
import EineLogger from "../libs/logger";
import EineDB from "../libs/db/EineDB";

import { EineEventTypeStr, EineServerOptions } from "../common/types";
import { EineRouteHandlerType, EineWebsocketHandlerType } from "./routes/types";

import { api, panel, ws } from './routes';

export default class EineServer {
  private eine: Eine;
  private db: EineDB;
  private logger: EineLogger;

  private serverConfig: EineServerOptions;
  private app: Express;

  private magicToken: string = "";
  private expireTime: number = 0;

  constructor(eine: Eine) {
    this.eine = eine;
    this.db = eine.db!;
    this.logger = eine.logger;
    this.serverConfig = this.eine.getOption("server") as EineServerOptions;

    // 实例化 Express
    this.app = express();

    // 添加 websocket 支持
    expressWs(this.app);

    // body-parser 中间件
    this.app.use(express.text());
    this.app.use(express.json());
    this.app.use(express.raw());

    // 访问日志中间件
    this.app.use(this.logRequestMiddleware.bind(this));

    // 错误处理中间件
    this.app.use(this.errorHandlerMiddleware.bind(this));

    // 跨域中间件
    if (this.serverConfig.cors) {
      this.app.use(cors({ origin: this.serverConfig.cors }));
    }

    // 设置静态目录
    this.app.use(express.static(path.join(__dirname, "build")));

    // 注册路由
    this.registerRouters();
  }

  /** 启动服务器 */
  startServer() {
    const { port, host } = this.serverConfig;

    return new Promise((resolve, reject) => {
      this.app.listen(port, host, () => {
        this.logger.info(
          "{}{}",
          chalk.magenta("Eine admin server is running on "),
          chalk.cyan(`http://${host}:${port}`)
        );
        this.eine.dispatch(EineEventTypeStr.AFTER_SERVER_START, null);
        resolve(null);
      });
    });
  }

  /** 注册路由 */
  private registerRouters() {
    const wrapRouter = (handler: (params: EineRouteHandlerType) => any) => {
      return async (req: Request, res: Response) =>
        await handler({
          req,
          res,
          eine: this.eine,
          logger: this.logger,
          db: this.db,
          server: this,
        });
    };

    const wrapWsRouter = (handler: (params: EineWebsocketHandlerType) => any) => {
      return async (ws: Websocket, req: Request, res: Response) =>
        await handler({
          req,
          res,
          ws,
          eine: this.eine,
          logger: this.logger,
          db: this.db,
          server: this,
        });
    }

    const sendHtmlDirectly = async (req: Request, res: Response) => {
      const isInstalled = await this.db.countUser({ role: 0 });
      if (isInstalled <= 0) {
        return res.redirect("/install");
      }    
      res.sendFile(path.join(__dirname, "build", "index.html"));
    }

    this.app.post("/api/login", api.login.validator, wrapRouter(api.login.handler));
    this.app.post("/api/install", api.install.validator, wrapRouter(api.install.handler));
    this.app.post("/api/send_text", api.sendText.validator, wrapRouter(api.sendText.handler));
    this.app.get("/api/account_info", api.accountInfo.validator, wrapRouter(api.accountInfo.handler));
    this.app.get("/api/public_info", api.publicInfo.validator, wrapRouter(api.publicInfo.handler));
    this.app.get("/api/group_info", api.groupInfo.validator, wrapRouter(api.groupInfo.handler));
    this.app.get("/api/refresh_magic_token", api.magic.validator, wrapRouter(api.magic.handler));
    this.app.get("/api/friend_info", api.friendInfo.validator, wrapRouter(api.friendInfo.handler));

    this.app.get("/install", panel.install.validator, wrapRouter(panel.install.handler));
    this.app.get("/login", sendHtmlDirectly);
    this.app.get("/panel/:path", sendHtmlDirectly);
    this.app.get("/", sendHtmlDirectly);

    (this.app as any).ws('/ws', wrapWsRouter(ws.default));
  }

  public pushMessage = ws.pushMessage;

  private logRequestMiddleware(req: Request, res: Response, next: any) {
    const end = res.end;
    (res.end as any) = (...args: any) => {
      this.logger.verbose(
        "{} {} -> {}",
        req.method,
        req.path,
        res.statusCode >= 400
          ? chalk.red(res.statusCode)
          : res.statusCode >= 300
          ? chalk.yellow(res.statusCode)
          : chalk.green(res.statusCode)
      );
      res.end = end;
      res.end(...args);
    }
    next();
  }

  private errorHandlerMiddleware(err: Error, req: Request, res: Response, next: any) {
    this.logger.error("{} {} -> {}, detail: ", req.method, req.url, chalk.red(500), err);
    console.error(chalk.red(err.stack));

    res.status(500).send({
      code: 500,
      stauts: "failed",
      message: "internal server error",
    });
  }

  public compareMagicToken(token: string) {
    return (+new Date() > this.expireTime) ? false : this.magicToken === token;
  }

  public async ensureInstalled(res: Response) {
    const userCount = await this.db.countUser({ role: 0 });
    if (userCount === 0)
      return res.redirect("/ui/install");
  }

  /** 生成特殊用途的 magic token */
  public generateMagicToken() {
    const charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz";
    const randomStr = (length: number) =>
      new Array(length)
        .fill(null)
        .map(() => charset.charAt(randomInt(charset.length)))
        .join("");

    this.magicToken = randomStr(10);
    this.expireTime = +new Date() + 1000 * 60 * 5;
    this.logger.essentialInfo("Server magic token: {} . This will be expired in 5 mins.", chalk.green(this.magicToken));
    setTimeout(() => this.expireMagicToken(), 5 * 60 * 1000);
    return this.magicToken;
  }

  /** 使 magic token 失效 */
  public expireMagicToken() {
    this.magicToken = "";
    this.expireTime = 0;
  }
}