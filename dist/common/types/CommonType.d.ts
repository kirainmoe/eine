export interface Friend {
    id: number;
    nickname: string;
    remark: string;
}
export interface GroupMember {
    id: number;
    memberName: string;
    specialTitle: string;
    permission: GroupPermission;
    joinTimestamp: number;
    lastSpeakTimestamp: number;
    muteTimeRemaining: number;
    group: GroupInfo;
}
export declare enum GroupPermission {
    OWNER = "OWNER",
    MEMBER = "MEMBER",
    ADMINISTRATOR = "ADMINISTRATOR"
}
export interface GroupInfo {
    id: number;
    name: string;
    permission: GroupPermission;
}
export declare enum Sex {
    UNKNOWN = "UNKNOWN",
    MALE = "MALE",
    FEMALE = "FEMALE"
}
export interface Profile {
    nickname: string;
    email: string;
    age: number;
    level: number;
    sign: number;
    sex: Sex;
}
export declare enum ContextType {
    FRIEND = "friend",
    GROUP = "group",
    TEMP = "temp"
}
export interface UploadPayload {
    name: string;
    id: string;
    path: string;
    parent: string | null;
    contact: GroupInfo;
    isFile: boolean;
    isDictionary: boolean;
    isDirectory: boolean;
}
export interface GroupConfig {
    name: string;
    announcement: string;
    confessTalk: boolean;
    allowMemberInvite: boolean;
    autoApprove: boolean;
    anonymousChat: boolean;
}
export interface EditableMemberInfo {
    name: string;
    specialTitle: string;
}
export declare enum FriendRequestOperate {
    ACCEPT = 0,
    DENY = 1,
    BLACKLIST = 2
}
export declare enum MemberJoinRequestOpearte {
    ACCEPT = 0,
    DENY = 1,
    IGNORE = 2,
    DENY_AND_BLACKLIST = 3,
    IGNORE_AND_BLACKLIST = 4
}
export declare enum InvitedJoinGroupRequestOperate {
    ACCEPT = 0,
    DENY = 1
}
