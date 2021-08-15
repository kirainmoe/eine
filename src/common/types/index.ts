/**
 * Eine Framework - Typescript Types File (类型定义文件)
 */

import { EventType } from "./EventType";
import { MessageType } from "./MessageType";

export * from "./EineType";
export * from "./EventType";
export * from "./CommonType";
export * from "./MessageType";
export * from "./MessageComponentType";

export type MessageEventType = MessageType | EventType;