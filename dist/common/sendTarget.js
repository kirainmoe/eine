"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Myself = exports.TempTarget = exports.GroupTarget = exports.FriendTarget = void 0;
var FriendTarget = function (qq) { return ({
    id: qq,
}); };
exports.FriendTarget = FriendTarget;
var GroupTarget = function (group) { return ({
    group: { id: group },
}); };
exports.GroupTarget = GroupTarget;
var TempTarget = function (qq, group) { return ({
    id: qq,
    group: { id: group },
}); };
exports.TempTarget = TempTarget;
var Myself = function () { return ({
    myself: true,
}); };
exports.Myself = Myself;
//# sourceMappingURL=sendTarget.js.map