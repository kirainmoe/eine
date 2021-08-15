"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextEquals = exports.TextContains = exports.SentToGroup = exports.SentBy = void 0;
const types_1 = require("../common/types");
const asStr_1 = __importDefault(require("./asStr"));
/**
 * 消息是否由特定 QQ 号发送
 * @param id QQ 号
 * @returns boolean
 */
const SentBy = (id) => {
    return (message, str) => message.sender.id === id;
};
exports.SentBy = SentBy;
/**
 * 消息是否发送给指定群
 * @param groupId 群号
 * @returns boolean
 */
const SentToGroup = (groupId) => {
    return (message, str) => message.type === types_1.MessageTypeStr.GROUP_MESSAGE && message.sender.group.id === groupId;
};
exports.SentToGroup = SentToGroup;
/**
 * 消息文字部分是否包含指定内容
 * @param text 指定内容
 * @returns boolean
 */
const TextContains = (text) => {
    return (message, str) => {
        return message.messageChain
            .filter((message) => message.type === types_1.MessageComponentTypeStr.PLAIN)
            .map((plain) => asStr_1.default(plain))
            .join(" ")
            .includes(text);
    };
};
exports.TextContains = TextContains;
/**
 * 消息文字部分是否等于指定内容
 * @param text 指定内容
 * @returns boolean
 */
const TextEquals = (text) => {
    return (message, str) => {
        return (message.messageChain
            .filter((message) => message.type === types_1.MessageComponentTypeStr.PLAIN)
            .map((plain) => asStr_1.default(plain))
            .join(" ") === text);
    };
};
exports.TextEquals = TextEquals;
//# sourceMappingURL=internalFilter.js.map