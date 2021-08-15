import Eine from "..";

import {
  EineEventName,
  EventFilter,
  EventIterator,
  EventTypeStr,
  FriendRequestOperate,
  InvitedJoinGroupRequestOperate,
  MemberJoinRequestOpearte,
  MessageChain,
  messageEventType,
  MessageTypeStr,
} from "../common/types";

import serializeMessage from "./serializeMessage";

/**
 * 为事件注入冗余属性和方法，方便进行某些操作
 * @param event 事件名称
 * @param payload 事件携带
 * @param eineInstance Eine 实例
 * @returns 
 */
export const injectExtraProperty = (event: EineEventName, payload: any = null, eineInstance: Eine) => {
  // 好友消息、群消息、临时消息和陌生人消息
  if (messageEventType.includes(event as MessageTypeStr)) {
    const reply = (messageChain: MessageChain, quote: boolean = false) => {
      switch (event) {
        case MessageTypeStr.FRIEND_MESSAGE:
        case MessageTypeStr.STRANGER_MESSAGE:
          return eineInstance.pickBest().sendFriendMessage(
            payload.sender.id,
            messageChain,
            quote ? payload.messageChain[0].id : undefined,
          );

        case MessageTypeStr.GROUP_MESSAGE:
          return eineInstance.pickBest().sendGroupMessage(
            payload.sender.group.id,
            messageChain,
            quote ? payload.messageChain[0].id : undefined
          );

        case MessageTypeStr.TEMP_MESSAGE:
          return eineInstance.pickBest().sendTempMessage(
            payload.sender.group.id,
            payload.sender.id,
            messageChain,
            quote ? payload.messageChain[0].id : undefined
          );
      }
    }; // reply()

    const recall = (sourceId: number) => eineInstance.pickBest().recall(sourceId);

    const wait = (iterator: EventIterator, filter: EventFilter) =>
      eineInstance.wait(payload.sender, event as MessageTypeStr, iterator, filter);

    return {
      messageStr: serializeMessage(payload.messageChain),
      reply: (messageChain: MessageChain) => reply(messageChain),
      quote: (messageChain: MessageChain) => reply(messageChain, true),
      recall: () => recall(payload.messageChain[0].id),
      wait,
    };
  }

  // 好友请求
  if (event === EventTypeStr.NEW_FRIEND_REQUEST_EVENT) {
    const { eventId, fromId, groupId } = payload;
    const accept = () =>
      eineInstance.pickBest().respondNewFriendRequest(eventId, fromId, groupId, FriendRequestOperate.ACCEPT);
    const deny = () =>
      eineInstance.pickBest().respondNewFriendRequest(eventId, fromId, groupId, FriendRequestOperate.DENY);
    return {
      accept,
      deny,
    };
  }

  // 新成员入群请求
  if (event === EventTypeStr.MEMBER_JOIN_REQUEST_EVENT) {
    const { eventId, fromId, groupId } = payload;
    const accept = () =>
      eineInstance.pickBest().respondMemberJoinRequest(eventId, fromId, groupId, MemberJoinRequestOpearte.ACCEPT);
    const deny = () =>
      eineInstance.pickBest().respondMemberJoinRequest(eventId, fromId, groupId, MemberJoinRequestOpearte.DENY);
    const ignore = () =>
      eineInstance.pickBest().respondMemberJoinRequest(eventId, fromId, groupId, MemberJoinRequestOpearte.IGNORE);
    return {
      accept,
      deny,
      ignore,
    };
  }

  // 邀请加群请求
  if (event === EventTypeStr.BOT_INVITED_JOIN_GROUP_REQUEST_EVENT) {
    const { eventId, fromId, groupId } = payload;
    const accept = () =>
      eineInstance
        .pickBest()
        .respondInvitedJoinGroupRequest(eventId, fromId, groupId, InvitedJoinGroupRequestOperate.ACCEPT);
    const deny = () =>
      eineInstance
        .pickBest()
        .respondInvitedJoinGroupRequest(eventId, fromId, groupId, InvitedJoinGroupRequestOperate.DENY);
    return {
      accept,
      deny,
    };
  }
}

export default injectExtraProperty;