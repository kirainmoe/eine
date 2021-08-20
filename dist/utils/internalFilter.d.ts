import { MessageType } from "../common/types";
/**
 * 消息是否由特定 QQ 号发送
 * @param id QQ 号
 * @returns function
 */
export declare const SentBy: (id: number) => (message: MessageType, str: string) => boolean;
/**
 * 消息是否发送给指定群
 * @param groupId 群号
 * @returns function
 */
export declare const SentToGroup: (groupId: number) => (message: MessageType, str: string) => boolean;
/**
 * 消息文字部分是否包含指定内容
 * @param text 指定内容
 * @returns function
 */
export declare const TextContains: (text: string) => (message: MessageType, str: string) => boolean;
/**
 * 消息文字部分是否等于指定内容
 * @param text 指定内容
 * @returns function
 */
export declare const TextEquals: (text: string) => (message: MessageType, str: string) => boolean;
/**
 * 消息文字部分是否以 text 开始
 * @param text 指定内容
 * @returns function
 */
export declare const TextStartsWith: (text: string) => (message: MessageType, str: string) => boolean;
/**
 * 消息文字部分是否以 text 结束
 * @param text 指定内容
 * @returns function
 */
export declare const TextEndsWith: (text: string) => (message: MessageType, str: string) => boolean;
/**
 * 消息是否来自群 groupId
 * @param groupId 群号
 * @returns function
 */
export declare const FromGroup: (groupId: number) => (message: MessageType, str: string) => boolean;
