import { Response } from "express";
import Eine from "..";
export default class EineServer {
    private eine;
    private db;
    private logger;
    private serverConfig;
    private app;
    private magicToken;
    private expireTime;
    constructor(eine: Eine);
    /** 启动服务器 */
    startServer(): Promise<unknown>;
    /** 注册路由 */
    private registerRouters;
    private logRequestMiddleware;
    private errorHandlerMiddleware;
    compareMagicToken(token: string): boolean;
    ensureInstalled(res: Response): Promise<void>;
    /** 生成特殊用途的 magic token */
    generateMagicToken(): string;
    /** 使 magic token 失效 */
    expireMagicToken(): void;
}
