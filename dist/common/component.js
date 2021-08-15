"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.File = exports.ForwardMessage = exports.MusicShare = exports.Dice = exports.Poke = exports.App = exports.Json = exports.Xml = exports.Voice = exports.FlashImage = exports.Image = exports.Plain = exports.Face = exports.AtAll = exports.At = void 0;
const MessageComponentType_1 = require("./types/MessageComponentType");
const At = (target) => ({
    type: MessageComponentType_1.MessageComponentTypeStr.AT,
    target,
    display: '',
});
exports.At = At;
const AtAll = () => ({
    type: MessageComponentType_1.MessageComponentTypeStr.AT_ALL,
});
exports.AtAll = AtAll;
const Face = (face) => ({
    type: MessageComponentType_1.MessageComponentTypeStr.FACE,
    ...(typeof face === 'number' ? { faceId: face } : { name: face })
});
exports.Face = Face;
const Plain = (text) => ({
    type: MessageComponentType_1.MessageComponentTypeStr.PLAIN,
    text,
});
exports.Plain = Plain;
const Image = (image) => ({
    type: MessageComponentType_1.MessageComponentTypeStr.IMAGE,
    ...image,
});
exports.Image = Image;
exports.Image.from = (file) => {
    return {
        type: MessageComponentType_1.MessageComponentTypeStr.PRELOAD,
        originType: MessageComponentType_1.MessageComponentTypeStr.IMAGE,
        file,
    };
};
const FlashImage = (flashImage) => ({
    type: MessageComponentType_1.MessageComponentTypeStr.FLASH_IMAGE,
    ...flashImage,
});
exports.FlashImage = FlashImage;
exports.FlashImage.from = (file) => {
    return {
        type: MessageComponentType_1.MessageComponentTypeStr.PRELOAD,
        originType: MessageComponentType_1.MessageComponentTypeStr.FLASH_IMAGE,
        file,
    };
};
const Voice = (voice) => ({
    type: MessageComponentType_1.MessageComponentTypeStr.VOICE,
    ...voice,
});
exports.Voice = Voice;
exports.Voice.from = (file) => {
    return {
        type: MessageComponentType_1.MessageComponentTypeStr.PRELOAD,
        originType: MessageComponentType_1.MessageComponentTypeStr.VOICE,
        file,
    };
};
const Xml = (xml) => ({
    type: MessageComponentType_1.MessageComponentTypeStr.XML,
    xml,
});
exports.Xml = Xml;
const Json = (json) => ({
    type: MessageComponentType_1.MessageComponentTypeStr.JSON,
    json,
});
exports.Json = Json;
const App = (app) => ({
    type: MessageComponentType_1.MessageComponentTypeStr.APP,
    app,
});
exports.App = App;
const Poke = (name) => ({
    type: MessageComponentType_1.MessageComponentTypeStr.POKE,
    name,
});
exports.Poke = Poke;
const Dice = (value) => ({
    type: MessageComponentType_1.MessageComponentTypeStr.DICE,
    value,
});
exports.Dice = Dice;
const MusicShare = (kind, title, summary, jumpUrl, pictureUrl, musicUrl, brief) => ({
    type: MessageComponentType_1.MessageComponentTypeStr.MUSIC_SHARE,
    kind,
    title,
    summary,
    jumpUrl,
    pictureUrl,
    musicUrl,
    brief,
});
exports.MusicShare = MusicShare;
const ForwardMessage = (nodeList) => ({
    type: MessageComponentType_1.MessageComponentTypeStr.FORWARD_MESSAGE,
    nodeList
});
exports.ForwardMessage = ForwardMessage;
const File = (id, name, size) => ({
    type: MessageComponentType_1.MessageComponentTypeStr.FILE,
    id,
    name,
    size,
});
exports.File = File;
exports.File.from = (file, uploadPath, filename) => {
    return {
        type: MessageComponentType_1.MessageComponentTypeStr.PRELOAD,
        originType: MessageComponentType_1.MessageComponentTypeStr.FILE,
        file,
        filename,
        path: uploadPath,
    };
};
//# sourceMappingURL=component.js.map