"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asStr = void 0;
var MessageComponentType_1 = require("../common/types/MessageComponentType");
var asStr = function (target) {
    if (typeof target === 'string')
        return target;
    if (target.type) {
        switch (target.type) {
            case MessageComponentType_1.MessageComponentTypeStr.AT:
                return "@" + target.display;
            case MessageComponentType_1.MessageComponentTypeStr.AT_ALL:
                return "@\u5168\u4F53\u6210\u5458";
            case MessageComponentType_1.MessageComponentTypeStr.FACE:
                return "[mirai:face:" + (target.faceId ? target.faceId : target.name) + "]";
            case MessageComponentType_1.MessageComponentTypeStr.PLAIN:
                return target.text;
            case MessageComponentType_1.MessageComponentTypeStr.IMAGE:
                return "[mirai:image:" + target.url + "]";
            case MessageComponentType_1.MessageComponentTypeStr.FLASH_IMAGE:
                return "[mirai:flash-image:" + target.url + "]";
            case MessageComponentType_1.MessageComponentTypeStr.VOICE:
                return "[mirai:voice:" + target.url + "]";
            case MessageComponentType_1.MessageComponentTypeStr.XML:
                return "[mirai:xml:" + target.xml + "]";
            case MessageComponentType_1.MessageComponentTypeStr.JSON:
                return "[mirai:json:" + target.json + "]";
            case MessageComponentType_1.MessageComponentTypeStr.APP:
                return "[mirai:app:" + target.app + "]";
            case MessageComponentType_1.MessageComponentTypeStr.POKE:
                return "[mirai:poke:" + target.name + "]";
            case MessageComponentType_1.MessageComponentTypeStr.DICE:
                return "[mirai:dice:" + target.value + "]";
            case MessageComponentType_1.MessageComponentTypeStr.MUSIC_SHARE:
                return "[mirai:music-share:" + target.title + "," + target.summary + "," + target.musicUrl + "]";
            case MessageComponentType_1.MessageComponentTypeStr.FILE:
                return "[mirai:file:" + target.name + "]";
            default:
                return '';
        }
    }
    if (target.toString)
        return target.toString();
    return '';
};
exports.asStr = asStr;
exports.default = exports.asStr;
//# sourceMappingURL=asStr.js.map