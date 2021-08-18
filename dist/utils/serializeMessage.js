"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeMessage = void 0;
var asStr_1 = __importDefault(require("./asStr"));
var serializeMessage = function (messageChain) {
    return messageChain.map(function (message) { return asStr_1.default(message); }).filter(function (item) { return item.length > 0; }).join(' ');
};
exports.serializeMessage = serializeMessage;
exports.default = exports.serializeMessage;
//# sourceMappingURL=serializeMessage.js.map