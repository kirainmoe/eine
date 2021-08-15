"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Myself = exports.TempTarget = exports.GroupTarget = exports.FriendTarget = void 0;
const FriendTarget = (qq) => ({
    id: qq,
});
exports.FriendTarget = FriendTarget;
const GroupTarget = (group) => ({
    group: { id: group },
});
exports.GroupTarget = GroupTarget;
const TempTarget = (qq, group) => ({
    id: qq,
    group: { id: group },
});
exports.TempTarget = TempTarget;
const Myself = () => ({
    myself: true,
});
exports.Myself = Myself;
//# sourceMappingURL=sender.js.map