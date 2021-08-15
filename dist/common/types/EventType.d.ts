import { Friend, GroupInfo, GroupMember, GroupPermission } from "./CommonType";
import { MessageChain } from "./MessageComponentType";
export declare enum EventTypeStr {
    BOT_ONLINE_EVENT = "BotOnlineEvent",
    BOT_OFFLINE_EVENT_ACTIVE = "BotOfflineEventActive",
    BOT_OFFLINE_EVENT_FORCE = "BotOfflineEventForce",
    BOT_OFFLINE_EVENT_DROPPED = "BotOfflineEventDropped",
    BOT_RELOGIN_EVENT = "BotReloginEvent",
    FRIEND_INPUT_STATUS_CHANGED_EVENT = "FriendInputStatusChangedEvent",
    FRIEND_NICK_CHANGED_EVENT = "FriendNickChangedEvent",
    FRIEND_RECALL_EVENT = "FriendRecallEvent",
    BOT_GROUP_PERMISSION_CHANGE_EVENT = "BotGroupPermissionChangeEvent",
    BOT_MUTE_EVENT = "BotMuteEvent",
    BOT_UNMUTE_EVENT = "BotUnmuteEvent",
    BOT_JOIN_GROUP_EVENT = "BotJoinGroupEvent",
    BOT_LEAVE_EVENT_ACTIVE = "BotLeaveEventActive",
    BOT_LEAVE_EVENT_KICK = "BotLeaveEventKick",
    GROUP_RECALL_EVENT = "GroupRecallEvent",
    GROUP_NAME_CHANGE_EVENT = "GroupNameChangeEvent",
    GROUP_ENTRANCE_ANNOUNCEMENT_CHANGE_EVENT = "GroupEntranceAnnouncementChangeEvent",
    GROUP_MUTE_ALL_EVENT = "GroupMuteAllEvent",
    GROUP_ALLOW_ANONYMOUS_CHAT_EVENT = "GroupAllowAnonymousChatEvent",
    GROUP_ALLOW_CONFESS_TALK_EVENT = "GroupAllowConfessTalkEvent",
    GROUP_ALLOW_MEMBER_INVITE_EVENT = "GroupAllowMemberInviteEvent",
    MEMBER_JOIN_EVENT = "MemberJoinEvent",
    MEMBER_LEAVE_EVENT_KICK = "MemberLeaveEventKick",
    MEMBER_LEAVE_EVENT_QUIT = "MemberLeaveEventQuit",
    MEMBER_CARD_CHANGE_EVENT = "MemberCardChangeEvent",
    MEMBER_SPECIAL_TITLE_CHANGE_EVENT = "MemberSpecialTitleChangeEvent",
    MEMBER_PERMISSION_CHANGE_EVENT = "MemberPermissionChangeEvent",
    MEMBER_MUTE_EVENT = "MemberMuteEvent",
    MEMBER_UNMUTE_EVENT = "MemberUnmuteEvent",
    MEMBER_HONOR_CHANGE_EVENT = "MemberHonorChangeEvent",
    NEW_FRIEND_REQUEST_EVENT = "NewFriendRequestEvent",
    MEMBER_JOIN_REQUEST_EVENT = "MemberJoinRequestEvent",
    BOT_INVITED_JOIN_GROUP_REQUEST_EVENT = "BotInvitedJoinGroupRequestEvent",
    COMMAND_EXECUTED_EVENT = "CommandExecutedEvent"
}
export declare enum HonorAction {
    ACHIEVE = "achieve",
    LOSE = "lose"
}
/** BOT 登录成功 */
export interface BotOnlineEvent {
    type: EventTypeStr.BOT_ONLINE_EVENT;
    qq: number;
}
/** BOT 主动离线 */
export interface BotOfflineEventActive {
    type: EventTypeStr.BOT_OFFLINE_EVENT_ACTIVE;
    qq: number;
}
/** BOT 被挤下线 */
export interface BotOfflineEventForce {
    type: EventTypeStr.BOT_OFFLINE_EVENT_FORCE;
    qq: number;
}
/** BOT 被服务器断开或因网络问题而掉线 */
export interface BotOfflineEventDropped {
    type: EventTypeStr.BOT_OFFLINE_EVENT_DROPPED;
    qq: number;
}
/** BOT 主动重新登录 */
export interface BotReloginEvent {
    type: EventTypeStr.BOT_RELOGIN_EVENT;
    qq: number;
}
export interface FriendInputStatusChangedEvent {
    type: EventTypeStr.FRIEND_INPUT_STATUS_CHANGED_EVENT;
    friend: Friend;
    inputting: boolean;
}
export interface FriendNickChangedEvent {
    type: EventTypeStr.FRIEND_NICK_CHANGED_EVENT;
    friend: Friend;
    from: string;
    to: string;
}
export interface FriendRecallEvent {
    type: EventTypeStr.FRIEND_RECALL_EVENT;
    authorId: number;
    messageId: number;
    time: number;
    operator: number;
}
export interface BotGroupPermissionChangeEvent {
    type: EventTypeStr.BOT_GROUP_PERMISSION_CHANGE_EVENT;
    origin: GroupPermission;
    current: GroupPermission;
    group: GroupInfo;
}
export interface BotMuteEvent {
    type: EventTypeStr.BOT_MUTE_EVENT;
    durationSeconds: number;
    operator: GroupMember;
}
export interface BotUnmuteEvent {
    type: EventTypeStr.BOT_UNMUTE_EVENT;
    operator: GroupMember;
}
export interface BotJoinGroupEvent {
    type: EventTypeStr.BOT_JOIN_GROUP_EVENT;
    group: GroupInfo;
}
export interface BotLeaveEventActive {
    type: EventTypeStr.BOT_LEAVE_EVENT_ACTIVE;
    group: GroupInfo;
}
export interface BotLeaveEventKick {
    type: EventTypeStr.BOT_LEAVE_EVENT_KICK;
    group: GroupInfo;
}
export interface GroupRecallEvent {
    type: EventTypeStr.GROUP_RECALL_EVENT;
    authorId: number;
    messageId: number;
    time: number;
    group: GroupInfo;
    operator: GroupMember;
}
export interface GroupNameChangeEvent {
    type: EventTypeStr.GROUP_NAME_CHANGE_EVENT;
    origin: string;
    current: string;
    group: GroupInfo;
    operator: GroupMember;
}
export interface GroupEntranceAnnouncementChangeEvent {
    type: EventTypeStr.GROUP_ENTRANCE_ANNOUNCEMENT_CHANGE_EVENT;
    origin: string;
    current: string;
    group: GroupInfo;
    operator: GroupMember;
}
export interface GroupMuteAllEvent {
    type: EventTypeStr.GROUP_MUTE_ALL_EVENT;
    origin: boolean;
    current: boolean;
    group: GroupInfo;
    operator: GroupMember;
}
export interface GroupAllowAnonymousChatEvent {
    type: EventTypeStr.GROUP_ALLOW_ANONYMOUS_CHAT_EVENT;
    origin: boolean;
    current: boolean;
    group: GroupInfo;
    operator: GroupMember;
}
export interface GroupAllowConfessTalkEvent {
    type: EventTypeStr.GROUP_ALLOW_CONFESS_TALK_EVENT;
    origin: boolean;
    current: boolean;
    group: GroupInfo;
    isByBot: boolean;
}
export interface GroupAllowMemberInviteEvent {
    type: EventTypeStr.GROUP_ALLOW_MEMBER_INVITE_EVENT;
    origin: boolean;
    current: boolean;
    group: GroupInfo;
    operator: GroupMember;
}
export interface MemberJoinEvent {
    type: EventTypeStr.MEMBER_JOIN_EVENT;
    member: GroupMember;
}
export interface MemberLeaveEventKick {
    type: EventTypeStr.MEMBER_LEAVE_EVENT_KICK;
    member: GroupMember;
    operator: GroupMember;
}
export interface MemberLeaveEventQuit {
    type: EventTypeStr.MEMBER_LEAVE_EVENT_QUIT;
    member: {
        id: number;
        memberName: string;
        permission: GroupPermission;
        group: GroupInfo;
    };
}
export interface MemberCardChangeEvent {
    type: EventTypeStr.MEMBER_CARD_CHANGE_EVENT;
    origin: string;
    current: string;
    member: GroupMember;
}
export interface MemberPermissionChangeEvent {
    type: EventTypeStr.MEMBER_PERMISSION_CHANGE_EVENT;
    origin: GroupPermission;
    current: GroupPermission;
    member: GroupMember;
}
export interface MemberSpecialTitleChangeEvent {
    type: EventTypeStr.MEMBER_SPECIAL_TITLE_CHANGE_EVENT;
    origin: string;
    current: string;
    member: GroupMember;
}
export interface MemberMuteEvent {
    type: EventTypeStr.MEMBER_MUTE_EVENT;
    durationSeconds: number;
    member: GroupMember;
    operator: GroupMember;
}
export interface MemberUnmuteEvent {
    type: EventTypeStr.MEMBER_UNMUTE_EVENT;
    member: GroupMember;
    operator: GroupMember;
}
export interface MemberHonorChangeEvent {
    type: EventTypeStr.MEMBER_HONOR_CHANGE_EVENT;
    member: GroupMember;
    action: HonorAction;
    honor: string;
}
export interface NewFriendRequestEvent {
    type: EventTypeStr.NEW_FRIEND_REQUEST_EVENT;
    eventId: number;
    fromId: number;
    groupId: number;
    nick: string;
    message: string;
}
export interface MemberJoinRequestEvent {
    type: EventTypeStr.MEMBER_JOIN_REQUEST_EVENT;
    eventId: number;
    fromId: number;
    groupId: number;
    groupName: string;
    nick: string;
    message: string;
}
export interface BotInvitedJoinGroupRequestEvent {
    type: EventTypeStr.BOT_INVITED_JOIN_GROUP_REQUEST_EVENT;
    eventId: number;
    fromId: number;
    groupId: number;
    groupName: string;
    nick: string;
    message: string;
}
export interface CommandExecutedEvent {
    type: EventTypeStr.COMMAND_EXECUTED_EVENT;
    name: string;
    friend: Friend | null;
    member: GroupMember | null;
    args: MessageChain;
}
export declare type EventType = BotOnlineEvent | BotOfflineEventActive | BotOfflineEventForce | BotOfflineEventDropped | BotReloginEvent | FriendInputStatusChangedEvent | FriendNickChangedEvent | FriendRecallEvent | BotGroupPermissionChangeEvent | BotMuteEvent | BotUnmuteEvent | BotJoinGroupEvent | BotLeaveEventActive | BotLeaveEventKick | GroupRecallEvent | GroupNameChangeEvent | GroupEntranceAnnouncementChangeEvent | GroupMuteAllEvent | GroupAllowAnonymousChatEvent | GroupAllowConfessTalkEvent | GroupAllowMemberInviteEvent | MemberJoinEvent | MemberLeaveEventKick | MemberLeaveEventQuit | MemberCardChangeEvent | MemberSpecialTitleChangeEvent | MemberPermissionChangeEvent | MemberMuteEvent | MemberUnmuteEvent | MemberHonorChangeEvent | NewFriendRequestEvent | MemberJoinRequestEvent | BotInvitedJoinGroupRequestEvent | CommandExecutedEvent;
