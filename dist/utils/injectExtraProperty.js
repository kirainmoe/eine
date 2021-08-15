"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.injectExtraProperty = void 0;
const types_1 = require("../common/types");
const serializeMessage_1 = __importDefault(require("./serializeMessage"));
/**
 * 为事件注入冗余属性和方法，方便进行某些操作
 * @param event 事件名称
 * @param payload 事件携带
 * @param eineInstance Eine 实例
 * @returns
 */
const injectExtraProperty = (event, payload = null, eineInstance) => {
    // 好友消息、群消息、临时消息和陌生人消息
    if (types_1.messageEventType.includes(event)) {
        const reply = (messageChain, quote = false) => {
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
        const recall = (sourceId) => eineInstance.pickBest().recall(sourceId);
        const wait = (iterator, filter) => eineInstance.wait(payload.sender, event, iterator, filter);
        return {
            messageStr: serializeMessage_1.default(payload.messageChain),
            reply: (messageChain) => reply(messageChain),
            quote: (messageChain) => reply(messageChain, true),
            recall: () => recall(payload.messageChain[0].id),
            wait,
        };
    }
    // 好友请求
    if (event === types_1.EventTypeStr.NEW_FRIEND_REQUEST_EVENT) {
        const { eventId, fromId, groupId } = payload;
        const accept = () => eineInstance.pickBest().respondNewFriendRequest(eventId, fromId, groupId, types_1.FriendRequestOperate.ACCEPT);
        const deny = () => eineInstance.pickBest().respondNewFriendRequest(eventId, fromId, groupId, types_1.FriendRequestOperate.DENY);
        return {
            accept,
            deny,
        };
    }
    // 新成员入群请求
    if (event === types_1.EventTypeStr.MEMBER_JOIN_REQUEST_EVENT) {
        const { eventId, fromId, groupId } = payload;
        const accept = () => eineInstance.pickBest().respondMemberJoinRequest(eventId, fromId, groupId, types_1.MemberJoinRequestOpearte.ACCEPT);
        const deny = () => eineInstance.pickBest().respondMemberJoinRequest(eventId, fromId, groupId, types_1.MemberJoinRequestOpearte.DENY);
        const ignore = () => eineInstance.pickBest().respondMemberJoinRequest(eventId, fromId, groupId, types_1.MemberJoinRequestOpearte.IGNORE);
        return {
            accept,
            deny,
            ignore,
        };
    }
    // 邀请加群请求
    if (event === types_1.EventTypeStr.BOT_INVITED_JOIN_GROUP_REQUEST_EVENT) {
        const { eventId, fromId, groupId } = payload;
        const accept = () => eineInstance
            .pickBest()
            .respondInvitedJoinGroupRequest(eventId, fromId, groupId, types_1.InvitedJoinGroupRequestOperate.ACCEPT);
        const deny = () => eineInstance
            .pickBest()
            .respondInvitedJoinGroupRequest(eventId, fromId, groupId, types_1.InvitedJoinGroupRequestOperate.DENY);
        return {
            accept,
            deny,
        };
    }
};
exports.injectExtraProperty = injectExtraProperty;
exports.default = exports.injectExtraProperty;
//# sourceMappingURL=injectExtraProperty.js.map