"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageEventType = exports.MessageTypeStr = void 0;
var MessageTypeStr;
(function (MessageTypeStr) {
    MessageTypeStr["FRIEND_MESSAGE"] = "FriendMessage";
    MessageTypeStr["GROUP_MESSAGE"] = "GroupMessage";
    MessageTypeStr["TEMP_MESSAGE"] = "TempMessage";
    MessageTypeStr["STRANGER_MESSAGE"] = "StrangerMessage";
    MessageTypeStr["OTHER_CLIENT_MESSAGE"] = "OtherClientMessage";
})(MessageTypeStr = exports.MessageTypeStr || (exports.MessageTypeStr = {}));
exports.messageEventType = [
    MessageTypeStr.FRIEND_MESSAGE,
    MessageTypeStr.GROUP_MESSAGE,
    MessageTypeStr.TEMP_MESSAGE,
    MessageTypeStr.STRANGER_MESSAGE,
];
//# sourceMappingURL=MessageType.js.map