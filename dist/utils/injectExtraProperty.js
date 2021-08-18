"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.injectExtraProperty = void 0;
var types_1 = require("../common/types");
var EventType_1 = require("../common/types/EventType");
var serializeMessage_1 = __importDefault(require("./serializeMessage"));
/**
 * 为事件注入冗余属性和方法，方便进行某些操作
 * @param event 事件名称
 * @param payload 事件携带
 * @param eineInstance Eine 实例
 * @returns object
 */
var injectExtraProperty = function (event, payload, eineInstance) {
    if (payload === void 0) { payload = null; }
    // 好友消息、群消息、临时消息和陌生人消息
    if (types_1.messageEventType.includes(event)) {
        var reply_1 = function (messageChain, quote) {
            if (quote === void 0) { quote = false; }
            switch (event) {
                case types_1.MessageTypeStr.FRIEND_MESSAGE:
                case types_1.MessageTypeStr.STRANGER_MESSAGE:
                    return eineInstance.pickBest().sendFriendMessage(payload.sender.id, messageChain, quote ? payload.messageChain[0].id : undefined);
                case types_1.MessageTypeStr.GROUP_MESSAGE:
                    return eineInstance.pickBest().sendGroupMessage(payload.sender.group.id, messageChain, quote ? payload.messageChain[0].id : undefined);
                case types_1.MessageTypeStr.TEMP_MESSAGE:
                    return eineInstance.pickBest().sendTempMessage(payload.sender.group.id, payload.sender.id, messageChain, quote ? payload.messageChain[0].id : undefined);
            }
        }; // reply()
        var recall_1 = function (sourceId) { return eineInstance.pickBest().recall(sourceId); };
        var wait = function (iterator, filter) {
            return eineInstance.wait(payload.sender, event, iterator, filter);
        };
        return {
            messageStr: serializeMessage_1.default(payload.messageChain),
            reply: function (messageChain) { return reply_1(messageChain); },
            quote: function (messageChain) { return reply_1(messageChain, true); },
            recall: function () { return recall_1(payload.messageChain[0].id); },
            wait: wait,
        };
    }
    // 好友请求
    if (event === EventType_1.EventTypeStr.NEW_FRIEND_REQUEST_EVENT) {
        var eventId_1 = payload.eventId, fromId_1 = payload.fromId, groupId_1 = payload.groupId;
        var accept = function () {
            return eineInstance.pickBest().respondNewFriendRequest(eventId_1, fromId_1, groupId_1, types_1.FriendRequestOperate.ACCEPT);
        };
        var deny = function () {
            return eineInstance.pickBest().respondNewFriendRequest(eventId_1, fromId_1, groupId_1, types_1.FriendRequestOperate.DENY);
        };
        return {
            accept: accept,
            deny: deny,
        };
    }
    // 新成员入群请求
    if (event === EventType_1.EventTypeStr.MEMBER_JOIN_REQUEST_EVENT) {
        var eventId_2 = payload.eventId, fromId_2 = payload.fromId, groupId_2 = payload.groupId;
        var accept = function () {
            return eineInstance.pickBest().respondMemberJoinRequest(eventId_2, fromId_2, groupId_2, types_1.MemberJoinRequestOpearte.ACCEPT);
        };
        var deny = function () {
            return eineInstance.pickBest().respondMemberJoinRequest(eventId_2, fromId_2, groupId_2, types_1.MemberJoinRequestOpearte.DENY);
        };
        var ignore = function () {
            return eineInstance.pickBest().respondMemberJoinRequest(eventId_2, fromId_2, groupId_2, types_1.MemberJoinRequestOpearte.IGNORE);
        };
        return {
            accept: accept,
            deny: deny,
            ignore: ignore,
        };
    }
    // 邀请加群请求
    if (event === EventType_1.EventTypeStr.BOT_INVITED_JOIN_GROUP_REQUEST_EVENT) {
        var eventId_3 = payload.eventId, fromId_3 = payload.fromId, groupId_3 = payload.groupId;
        var accept = function () {
            return eineInstance
                .pickBest()
                .respondInvitedJoinGroupRequest(eventId_3, fromId_3, groupId_3, types_1.InvitedJoinGroupRequestOperate.ACCEPT);
        };
        var deny = function () {
            return eineInstance
                .pickBest()
                .respondInvitedJoinGroupRequest(eventId_3, fromId_3, groupId_3, types_1.InvitedJoinGroupRequestOperate.DENY);
        };
        return {
            accept: accept,
            deny: deny,
        };
    }
};
exports.injectExtraProperty = injectExtraProperty;
exports.default = exports.injectExtraProperty;
//# sourceMappingURL=injectExtraProperty.js.map