"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FromGroup = exports.TextEndsWith = exports.TextStartsWith = exports.TextEquals = exports.TextContains = exports.SentToGroup = exports.SentBy = void 0;
var types_1 = require("../common/types");
var MessageComponentType_1 = require("../common/types/MessageComponentType");
var asStr_1 = __importDefault(require("./asStr"));
/**
 * 消息是否由特定 QQ 号发送
 * @param id QQ 号
 * @returns function
 */
var SentBy = function (id) {
    return function (message, str) { return message.sender.id === id; };
};
exports.SentBy = SentBy;
/**
 * 消息是否发送给指定群
 * @param groupId 群号
 * @returns function
 */
var SentToGroup = function (groupId) {
    return function (message, str) {
        return message.type === types_1.MessageTypeStr.GROUP_MESSAGE && message.sender.group.id === groupId;
    };
};
exports.SentToGroup = SentToGroup;
/**
 * 消息文字部分是否包含指定内容
 * @param text 指定内容
 * @returns function
 */
var TextContains = function (text) {
    return function (message, str) {
        return message.messageChain
            .filter(function (message) { return message.type === MessageComponentType_1.MessageComponentTypeStr.PLAIN; })
            .map(function (plain) { return asStr_1.default(plain); })
            .join(" ")
            .includes(text);
    };
};
exports.TextContains = TextContains;
/**
 * 消息文字部分是否等于指定内容
 * @param text 指定内容
 * @returns function
 */
var TextEquals = function (text) {
    return function (message, str) {
        return (message.messageChain
            .filter(function (message) { return message.type === MessageComponentType_1.MessageComponentTypeStr.PLAIN; })
            .map(function (plain) { return asStr_1.default(plain); })
            .join(" ") === text);
    };
};
exports.TextEquals = TextEquals;
/**
 * 消息文字部分是否以 text 开始
 * @param text 指定内容
 * @returns function
 */
var TextStartsWith = function (text) {
    return function (message, str) {
        return (message.messageChain
            .filter(function (message) { return message.type === MessageComponentType_1.MessageComponentTypeStr.PLAIN; })
            .map(function (plain) { return asStr_1.default(plain); })
            .join(" ")
            .startsWith(text));
    };
};
exports.TextStartsWith = TextStartsWith;
/**
 * 消息文字部分是否以 text 结束
 * @param text 指定内容
 * @returns function
 */
var TextEndsWith = function (text) {
    return function (message, str) {
        return (message.messageChain
            .filter(function (message) { return message.type === MessageComponentType_1.MessageComponentTypeStr.PLAIN; })
            .map(function (plain) { return asStr_1.default(plain); })
            .join(" ")
            .endsWith(text));
    };
};
exports.TextEndsWith = TextEndsWith;
/**
 * 消息是否来自群 groupId
 * @param groupId 群号
 * @returns function
 */
var FromGroup = function (groupId) {
    return function (message, str) {
        return message.type === types_1.MessageTypeStr.GROUP_MESSAGE && message.sender.group.id === groupId;
    };
};
exports.FromGroup = FromGroup;
//# sourceMappingURL=internalFilter.js.map