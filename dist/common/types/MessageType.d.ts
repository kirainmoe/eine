import { Friend, GroupMember } from "./CommonType";
import { MessageChain } from "./MessageComponentType";
export declare enum MessageTypeStr {
    FRIEND_MESSAGE = "FriendMessage",
    GROUP_MESSAGE = "GroupMessage",
    TEMP_MESSAGE = "TempMessage",
    STRANGER_MESSAGE = "StrangerMessage",
    OTHER_CLIENT_MESSAGE = "OtherClientMessage"
}
export declare type FriendMessageSender = Friend;
/** 好友消息 */
export interface FriendMessage {
    type: MessageTypeStr.FRIEND_MESSAGE;
    sender: FriendMessageSender;
    messageChain: MessageChain;
}
export declare type GroupMessageSender = GroupMember;
export interface GroupMessage {
    type: MessageTypeStr.GROUP_MESSAGE;
    sender: GroupMessageSender;
    messageChain: MessageChain;
}
export declare type TempMessageSender = GroupMessageSender;
export interface TempMessage {
    type: MessageTypeStr.TEMP_MESSAGE;
    sender: TempMessageSender;
    messageChain: MessageChain;
}
export declare type StrangerMessageSender = Friend;
export interface StrangerMessage {
    type: MessageTypeStr.STRANGER_MESSAGE;
    sender: StrangerMessageSender;
    messageChain: MessageChain;
}
export interface OtherClientMessageSender {
    id: number;
    platform: string;
}
export interface OtherClientMessage {
    type: MessageTypeStr.OTHER_CLIENT_MESSAGE;
    sender: OtherClientMessageSender;
    messageChain: MessageChain;
}
export interface SendTarget {
    id?: number;
    group?: {
        id?: number;
    };
    myself?: boolean;
}
export declare type SenderType = FriendMessageSender | GroupMessageSender | TempMessageSender | StrangerMessageSender | OtherClientMessageSender;
export declare type MessageType = FriendMessage | GroupMessage | TempMessage | StrangerMessage | OtherClientMessage;
export declare const messageEventType: MessageTypeStr[];
