"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileFrom = exports.File = exports.ForwardMessage = exports.MusicShare = exports.Dice = exports.Poke = exports.App = exports.Json = exports.Xml = exports.VoiceFrom = exports.Voice = exports.FlashImageFrom = exports.FlashImage = exports.ImageFrom = exports.Image = exports.Plain = exports.Face = exports.AtAll = exports.At = void 0;
var MessageComponentType_1 = require("./types/MessageComponentType");
var At = function (target) { return ({
    type: MessageComponentType_1.MessageComponentTypeStr.AT,
    target: target,
    display: '',
}); };
exports.At = At;
var AtAll = function () { return ({
    type: MessageComponentType_1.MessageComponentTypeStr.AT_ALL,
}); };
exports.AtAll = AtAll;
var Face = function (face) { return (__assign({ type: MessageComponentType_1.MessageComponentTypeStr.FACE }, (typeof face === 'number' ? { faceId: face } : { name: face }))); };
exports.Face = Face;
var Plain = function (text) { return ({
    type: MessageComponentType_1.MessageComponentTypeStr.PLAIN,
    text: text,
}); };
exports.Plain = Plain;
var Image = function (image) { return (__assign({ type: MessageComponentType_1.MessageComponentTypeStr.IMAGE }, image)); };
exports.Image = Image;
var ImageFrom = function (file) {
    return {
        type: MessageComponentType_1.MessageComponentTypeStr.PRELOAD,
        originType: MessageComponentType_1.MessageComponentTypeStr.IMAGE,
        file: file,
    };
};
exports.ImageFrom = ImageFrom;
var FlashImage = function (flashImage) { return (__assign({ type: MessageComponentType_1.MessageComponentTypeStr.FLASH_IMAGE }, flashImage)); };
exports.FlashImage = FlashImage;
var FlashImageFrom = function (file) {
    return {
        type: MessageComponentType_1.MessageComponentTypeStr.PRELOAD,
        originType: MessageComponentType_1.MessageComponentTypeStr.FLASH_IMAGE,
        file: file,
    };
};
exports.FlashImageFrom = FlashImageFrom;
var Voice = function (voice) { return (__assign({ type: MessageComponentType_1.MessageComponentTypeStr.VOICE }, voice)); };
exports.Voice = Voice;
var VoiceFrom = function (file) {
    return {
        type: MessageComponentType_1.MessageComponentTypeStr.PRELOAD,
        originType: MessageComponentType_1.MessageComponentTypeStr.VOICE,
        file: file,
    };
};
exports.VoiceFrom = VoiceFrom;
var Xml = function (xml) { return ({
    type: MessageComponentType_1.MessageComponentTypeStr.XML,
    xml: xml,
}); };
exports.Xml = Xml;
var Json = function (json) { return ({
    type: MessageComponentType_1.MessageComponentTypeStr.JSON,
    json: json,
}); };
exports.Json = Json;
var App = function (app) { return ({
    type: MessageComponentType_1.MessageComponentTypeStr.APP,
    app: app,
}); };
exports.App = App;
var Poke = function (name) { return ({
    type: MessageComponentType_1.MessageComponentTypeStr.POKE,
    name: name,
}); };
exports.Poke = Poke;
var Dice = function (value) { return ({
    type: MessageComponentType_1.MessageComponentTypeStr.DICE,
    value: value,
}); };
exports.Dice = Dice;
var MusicShare = function (kind, title, summary, jumpUrl, pictureUrl, musicUrl, brief) { return ({
    type: MessageComponentType_1.MessageComponentTypeStr.MUSIC_SHARE,
    kind: kind,
    title: title,
    summary: summary,
    jumpUrl: jumpUrl,
    pictureUrl: pictureUrl,
    musicUrl: musicUrl,
    brief: brief,
}); };
exports.MusicShare = MusicShare;
var ForwardMessage = function (nodeList) { return ({
    type: MessageComponentType_1.MessageComponentTypeStr.FORWARD_MESSAGE,
    nodeList: nodeList
}); };
exports.ForwardMessage = ForwardMessage;
var File = function (id, name, size) { return ({
    type: MessageComponentType_1.MessageComponentTypeStr.FILE,
    id: id,
    name: name,
    size: size,
}); };
exports.File = File;
var FileFrom = function (file, uploadPath, filename) {
    return {
        type: MessageComponentType_1.MessageComponentTypeStr.PRELOAD,
        originType: MessageComponentType_1.MessageComponentTypeStr.FILE,
        file: file,
        filename: filename,
        path: uploadPath,
    };
};
exports.FileFrom = FileFrom;
//# sourceMappingURL=component.js.map