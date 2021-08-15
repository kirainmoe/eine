"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asStr = void 0;
const types_1 = require("../common/types");
const asStr = (target) => {
    if (typeof target === 'string')
        return target;
    if (target.type) {
        switch (target.type) {
            case types_1.MessageComponentTypeStr.AT:
                return `@${target.display}`;
            case types_1.MessageComponentTypeStr.AT_ALL:
                return `@全体成员`;
            case types_1.MessageComponentTypeStr.FACE:
                return `[mirai:face:${target.faceId ? target.faceId : target.name}]`;
            case types_1.MessageComponentTypeStr.PLAIN:
                return target.text;
            case types_1.MessageComponentTypeStr.IMAGE:
                return `[mirai:image:${target.url}]`;
            case types_1.MessageComponentTypeStr.FLASH_IMAGE:
                return `[mirai:flash-image:${target.url}]`;
            case types_1.MessageComponentTypeStr.VOICE:
                return `[mirai:voice:${target.url}]`;
            case types_1.MessageComponentTypeStr.XML:
                return `[mirai:xml:${target.xml}]`;
            case types_1.MessageComponentTypeStr.JSON:
                return `[mirai:json:${target.json}]`;
            case types_1.MessageComponentTypeStr.APP:
                return `[mirai:app:${target.app}]`;
            case types_1.MessageComponentTypeStr.POKE:
                return `[mirai:poke:${target.name}]`;
            case types_1.MessageComponentTypeStr.DICE:
                return `[mirai:dice:${target.value}]`;
            case types_1.MessageComponentTypeStr.MUSIC_SHARE:
                return `[mirai:music-share:${target.title},${target.summary},${target.musicUrl}]`;
            case types_1.MessageComponentTypeStr.FILE:
                return `[mirai:file:${target.name}]`;
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