/**
 * Eine Framework - Typescript Types File (类型定义文件)
 */
import { EventType, EventTypeStr } from "./EventType";
import { MessageComponentTypeStr } from "./MessageComponentType";
import { MessageType } from "./MessageType";
export * from "./EineType";
export * from "./CommonType";
export * from "./MessageType";
export * as PainterType from "./PainterType";
export * as DBType from "./DBType";
export * as SchedulerType from "./SchedulerType";
export * as BotEventType from "./EventType";
export * as MessageComponentType from "./MessageComponentType";
export { MessageComponentTypeStr, EventTypeStr, };
export declare type MessageEventType = MessageType | EventType;
