import Eine from "../..";
import { MessageChain, MessageTypeStr, SenderType, SendTarget } from "../../common/types";
import { MongoConfig } from "./types";
export default class EineDB {
    private config;
    private mongoUrl;
    private client;
    private eine;
    private botId;
    private db;
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
}
