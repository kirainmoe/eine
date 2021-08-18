/**
 * Eine Framework - Typescript Types File (类型定义文件)
 */
import { EventType, EventTypeStr } from "./EventType";
import { MessageComponentTypeStr } from "./MessageComponentType";
import { MessageType } from "./MessageType";
import { EineOption, EineServerOptions, HttpAdapterSetting, WebsocketAdapterSetting, EventCallbackParams, EventInterruptParams, EventHandler } from "./EineType";
import { Friend, GroupMember, GroupPermission, GroupInfo, Profile, GroupConfig, EditableMemberInfo } from "./CommonType";
import { FriendMessage, GroupMessage, TempMessage, StrangerMessage, OtherClientMessage, OtherClientMessageSender, SendTarget } from "./MessageType";
export * from "./EineType";
export * from "./CommonType";
export * from "./MessageType";
export * as PainterType from "./PainterType";
export * as DBType from "./DBType";
export * as SchedulerType from "./SchedulerType";
export * as BotEventType from "./EventType";
export * as MessageComponentType from "./MessageComponentType";
export { MessageComponentTypeStr, EventTypeStr, };
export { EineOption, EineServerOptions, HttpAdapterSetting, WebsocketAdapterSetting, EventCallbackParams, EventInterruptParams, EventHandler, Friend, GroupMember, GroupPermission, GroupInfo, Profile, GroupConfig, EditableMemberInfo, FriendMessage, GroupMessage, TempMessage, StrangerMessage, OtherClientMessage, OtherClientMessageSender, SendTarget };
export declare type MessageEventType = MessageType | EventType;
