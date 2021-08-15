import { Friend, GroupInfo, GroupMember, GroupPermission } from "./CommonType";

import { MessageChain } from "./MessageComponentType";

export enum MessageTypeStr {
  FRIEND_MESSAGE = "FriendMessage",
  GROUP_MESSAGE = "GroupMessage",
  TEMP_MESSAGE = "TempMessage",
  STRANGER_MESSAGE = "StrangerMessage",
  OTHER_CLIENT_MESSAGE = "OtherClientMessage",
}

// ------------- 好友消息 -------------

export type FriendMessageSender = Friend;

/** 好友消息 */
export interface FriendMessage {
  type: MessageTypeStr.FRIEND_MESSAGE;
  sender: FriendMessageSender;
  messageChain: MessageChain;
}

// ------------- 群消息 -------------

export type GroupMessageSender = GroupMember;

export interface GroupMessage {
  type: MessageTypeStr.GROUP_MESSAGE;
  sender: GroupMessageSender;
  messageChain: MessageChain;
}

// ------------- 临时消息 -------------

export type TempMessageSender = GroupMessageSender;

export interface TempMessage {
  type: MessageTypeStr.TEMP_MESSAGE;
  sender: TempMessageSender;
  messageChain: MessageChain;
}

// ------------- 陌生人消息 -------------

export type StrangerMessageSender = Friend;

export interface StrangerMessage {
  type: MessageTypeStr.STRANGER_MESSAGE;
  sender: StrangerMessageSender;
  messageChain: MessageChain;
}

// ------------- 其它客户端消息 -------------

export interface OtherClientMessageSender {
  id: number;
  platform: string;
}

export interface OtherClientMessage {
  type: MessageTypeStr.OTHER_CLIENT_MESSAGE;
  sender: OtherClientMessageSender;
  messageChain: MessageChain;
}

// ------------- 发送目标 ------------------
export interface SendTarget {
  id?: number;
  group?: { id?: number };
  myself?: boolean;
}

export type SenderType = FriendMessageSender | GroupMessageSender | TempMessageSender | StrangerMessageSender | OtherClientMessageSender;

export type MessageType = FriendMessage | GroupMessage | TempMessage | StrangerMessage | OtherClientMessage;

export const messageEventType = [
  MessageTypeStr.FRIEND_MESSAGE,
  MessageTypeStr.GROUP_MESSAGE,
  MessageTypeStr.TEMP_MESSAGE,
  MessageTypeStr.STRANGER_MESSAGE,
];