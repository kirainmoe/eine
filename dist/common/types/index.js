"use strict";
/**
 * Eine Framework - Typescript Types File (类型定义文件)
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupPermission = exports.EventTypeStr = exports.MessageComponentTypeStr = exports.MessageComponentType = exports.BotEventType = exports.SchedulerType = exports.DBType = exports.PainterType = void 0;
var EventType_1 = require("./EventType");
Object.defineProperty(exports, "EventTypeStr", { enumerable: true, get: function () { return EventType_1.EventTypeStr; } });
var MessageComponentType_1 = require("./MessageComponentType");
Object.defineProperty(exports, "MessageComponentTypeStr", { enumerable: true, get: function () { return MessageComponentType_1.MessageComponentTypeStr; } });
var CommonType_1 = require("./CommonType");
Object.defineProperty(exports, "GroupPermission", { enumerable: true, get: function () { return CommonType_1.GroupPermission; } });
__exportStar(require("./EineType"), exports);
__exportStar(require("./CommonType"), exports);
__exportStar(require("./MessageType"), exports);
exports.PainterType = __importStar(require("./PainterType"));
exports.DBType = __importStar(require("./DBType"));
exports.SchedulerType = __importStar(require("./SchedulerType"));
exports.BotEventType = __importStar(require("./EventType"));
exports.MessageComponentType = __importStar(require("./MessageComponentType"));
//# sourceMappingURL=index.js.map