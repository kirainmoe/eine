"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitedJoinGroupRequestOperate = exports.MemberJoinRequestOpearte = exports.FriendRequestOperate = exports.ContextType = exports.Sex = exports.GroupPermission = void 0;
var GroupPermission;
(function (GroupPermission) {
    GroupPermission["OWNER"] = "OWNER";
    GroupPermission["MEMBER"] = "MEMBER";
    GroupPermission["ADMINISTRATOR"] = "ADMINISTRATOR";
})(GroupPermission = exports.GroupPermission || (exports.GroupPermission = {}));
var Sex;
(function (Sex) {
    Sex["UNKNOWN"] = "UNKNOWN";
    Sex["MALE"] = "MALE";
    Sex["FEMALE"] = "FEMALE";
})(Sex = exports.Sex || (exports.Sex = {}));
var ContextType;
(function (ContextType) {
    ContextType["FRIEND"] = "friend";
    ContextType["GROUP"] = "group";
    ContextType["TEMP"] = "temp";
})(ContextType = exports.ContextType || (exports.ContextType = {}));
var FriendRequestOperate;
(function (FriendRequestOperate) {
    FriendRequestOperate[FriendRequestOperate["ACCEPT"] = 0] = "ACCEPT";
    FriendRequestOperate[FriendRequestOperate["DENY"] = 1] = "DENY";
    FriendRequestOperate[FriendRequestOperate["BLACKLIST"] = 2] = "BLACKLIST";
})(FriendRequestOperate = exports.FriendRequestOperate || (exports.FriendRequestOperate = {}));
var MemberJoinRequestOpearte;
(function (MemberJoinRequestOpearte) {
    MemberJoinRequestOpearte[MemberJoinRequestOpearte["ACCEPT"] = 0] = "ACCEPT";
    MemberJoinRequestOpearte[MemberJoinRequestOpearte["DENY"] = 1] = "DENY";
    MemberJoinRequestOpearte[MemberJoinRequestOpearte["IGNORE"] = 2] = "IGNORE";
    MemberJoinRequestOpearte[MemberJoinRequestOpearte["DENY_AND_BLACKLIST"] = 3] = "DENY_AND_BLACKLIST";
    MemberJoinRequestOpearte[MemberJoinRequestOpearte["IGNORE_AND_BLACKLIST"] = 4] = "IGNORE_AND_BLACKLIST";
})(MemberJoinRequestOpearte = exports.MemberJoinRequestOpearte || (exports.MemberJoinRequestOpearte = {}));
var InvitedJoinGroupRequestOperate;
(function (InvitedJoinGroupRequestOperate) {
    InvitedJoinGroupRequestOperate[InvitedJoinGroupRequestOperate["ACCEPT"] = 0] = "ACCEPT";
    InvitedJoinGroupRequestOperate[InvitedJoinGroupRequestOperate["DENY"] = 1] = "DENY";
})(InvitedJoinGroupRequestOperate = exports.InvitedJoinGroupRequestOperate || (exports.InvitedJoinGroupRequestOperate = {}));
//# sourceMappingURL=CommonType.js.map