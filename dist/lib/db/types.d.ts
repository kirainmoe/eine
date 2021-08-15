import { MessageChain, SenderType, SendTarget } from "../../common/types";
export interface MongoConfig {
    host: string;
    port: number;
    username: string;
    password: string;
    dbName: string;
}
export interface SaveMessageItem {
    messageChain: MessageChain;
    time: number;
    sender: SenderType | SendTarget;
    target: SenderType | SendTarget;
    type: "incoming" | "outgoing";
}
