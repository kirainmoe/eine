import { GroupMessageSender, MessageType, MessageTypeStr } from "../common/types";

import { MessageComponentTypeStr, MessageComponentType } from "../common/types/MessageComponentType";

import asStr from "./asStr";

/**
 * 消息是否由特定 QQ 号发送
 * @param id QQ 号
 * @returns function
 */
export const SentBy = (id: number) => {
  return (message: MessageType, str: string) => message.sender.id === id;
};

/**
 * 消息是否发送给指定群
 * @param groupId 群号
 * @returns function
 */
export const SentToGroup = (groupId: number) => {
  return (message: MessageType, str: string) =>
    message.type === MessageTypeStr.GROUP_MESSAGE && (message.sender as GroupMessageSender).group.id === groupId;
};

/**
 * 消息文字部分是否包含指定内容
 * @param text 指定内容
 * @returns function
 */
export const TextContains = (text: string) => {
  return (message: MessageType, str: string) => {
    return message.messageChain
      .filter((message) => (message as MessageComponentType).type === MessageComponentTypeStr.PLAIN)
      .map((plain) => asStr(plain))
      .join(" ")
      .includes(text);
  };
};

/**
 * 消息文字部分是否等于指定内容
 * @param text 指定内容
 * @returns function
 */
export const TextEquals = (text: string) => {
  return (message: MessageType, str: string) => {
    return (
      message.messageChain
        .filter((message) => (message as MessageComponentType).type === MessageComponentTypeStr.PLAIN)
        .map((plain) => asStr(plain))
        .join(" ") === text
    );
  };
};

/**
 * 消息文字部分是否以 text 开始
 * @param text 指定内容
 * @returns function
 */
export const TextStartsWith = (text: string) => {
  return (message: MessageType, str: string) => {
    return (
      message.messageChain
        .filter((message) => (message as MessageComponentType).type === MessageComponentTypeStr.PLAIN)
        .map((plain) => asStr(plain))
        .join(" ")
        .startsWith(text)
    );
  };
}

/**
 * 消息文字部分是否以 text 结束
 * @param text 指定内容
 * @returns function
 */
export const TextEndsWith = (text: string) => {
  return (message: MessageType, str: string) => {
    return (
      message.messageChain
        .filter((message) => (message as MessageComponentType).type === MessageComponentTypeStr.PLAIN)
        .map((plain) => asStr(plain))
        .join(" ")
        .endsWith(text)
    );
  };
}

/**
 * 消息是否来自群 groupId
 * @param groupId 群号
 * @returns function
 */
export const FromGroup = (groupId: number) => {
  return (message: MessageType, str: string) => {
    return message.type === MessageTypeStr.GROUP_MESSAGE && (message.sender as GroupMessageSender).group.id === groupId;
  };
};