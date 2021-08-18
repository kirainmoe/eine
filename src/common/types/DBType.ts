import { SenderType, SendTarget } from "./index";
import { MessageChain } from "./MessageComponentType";

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