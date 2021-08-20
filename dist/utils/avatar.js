"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroupAvatarUrl = exports.getUserAvatarUrl = void 0;
var getUserAvatarUrl = function (userId) { return "http://q.qlogo.cn/g?b=qq&s=100&nk=" + userId; };
exports.getUserAvatarUrl = getUserAvatarUrl;
var getGroupAvatarUrl = function (groupId) { return "http://p.qlogo.cn/gh/" + groupId + "/" + groupId + "/0"; };
exports.getGroupAvatarUrl = getGroupAvatarUrl;
//# sourceMappingURL=avatar.js.map