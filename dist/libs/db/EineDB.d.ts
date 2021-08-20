import { Db, Filter } from "mongodb";
import Eine from "../..";
import { MessageTypeStr, SenderType, SendTarget } from "../../common/types";
import { MessageChain } from "../../common/types/MessageComponentType";
import { MongoConfig } from "../../common/types/DBType";
export default class EineDB {
    private config;
    private mongoUrl;
    private client;
    private eine;
    private botId;
    private _db;
    get db(): Db | null;
    private logger;
    isConnected: boolean;
    constructor(config: Partial<MongoConfig>, eine: Eine);
    private ensureDatabaseConnected;
    getCollectionKey(type: MessageTypeStr, sender: SenderType | SendTarget, target?: SenderType | SendTarget): string;
    connect(): Promise<void>;
    close(): Promise<void>;
    saveIncomingMessage(type: MessageTypeStr, sender: SenderType, target: SendTarget, messageChain: MessageChain): Promise<import("mongodb").InsertManyResult<import("bson").Document>>;
    saveOutgoingMessage(type: MessageTypeStr, sender: SendTarget, target: SenderType, messageChain: MessageChain): Promise<import("mongodb").InsertManyResult<import("bson").Document>>;
    findMessage(type: MessageTypeStr, sourceOrDestination: SenderType | SendTarget, direction: "incoming | outgoing", filterCond?: any): import("mongodb").FindCursor<import("bson").Document>;
    dropMessage(type: MessageTypeStr, sourceOrDestination: SenderType | SendTarget): Promise<boolean>;
    /**
     * 统计符合条件的用户数量
     * @param filter 条件
     * @returns Promise<number>
     */
    countUser(filter?: Filter<Document>): Promise<number>;
    login(username: string, password: string): Promise<false | {
        uid: number;
        authToken: string;
        expire: number;
    }>;
    expiresOutdatedAuthToken(uid: number): Promise<void>;
    updateAuthToken(uid: number, authToken: string): Promise<{
        uid: number;
        authToken: string;
        expire: number;
    }>;
    authenticate(uid: number, authToken: string): Promise<boolean>;
    /**
     * 创建用户
     * @param username 用户名
     * @param password 密码
     * @param role 角色
     * @returns Promise
     */
    createUser(username: string, password: string, role: number): Promise<{
        uid: number;
        payload: import("mongodb").InsertManyResult<import("bson").Document>;
    }>;
    md5(target: string): string;
}
