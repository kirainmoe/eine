import { Response } from "express";
import Eine from "..";
import { EineRouteHandlerType } from "./routes/types";
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
    /** 自定义路由 */
    private routes;
    /** 添加自定义路由 */
    addRoute(method: 'GET' | 'POST', url: string, handler: (params: EineRouteHandlerType) => any): void;
    /** 注册路由 */
    private registerRouters;
    pushMessage: ({ type, sender, messageChain, str }: {
        type: import("../common/types").MessageTypeStr;
        sender: import("../common/types").SenderType;
        messageChain: import("../common/types/MessageComponentType").MessageChain;
        str: string;
    }) => void;
    private logRequestMiddleware;
    private errorHandlerMiddleware;
    compareMagicToken(token: string): boolean;
    ensureInstalled(res: Response): Promise<void>;
    /** 生成特殊用途的 magic token */
    generateMagicToken(): string;
    /** 使 magic token 失效 */
    expireMagicToken(): void;
}
