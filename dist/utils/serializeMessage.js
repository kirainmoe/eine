"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeMessage = void 0;
const asStr_1 = __importDefault(require("./asStr"));
const serializeMessage = (messageChain) => {
    return messageChain.map(message => asStr_1.default(message)).filter(item => item.length > 0).join(' ');
};
exports.serializeMessage = serializeMessage;
exports.default = exports.serializeMessage;
//# sourceMappingURL=serializeMessage.js.map