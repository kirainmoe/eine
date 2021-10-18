"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EINE_DEFAULT_OPTIONS = exports.EINE_VERSION = exports.EINE = void 0;
var types_1 = require("./types");
/** Framework 全局名称 */
exports.EINE = "Eine";
/** Framework 版本 */
exports.EINE_VERSION = "0.0.30";
/** Eine Framework 实例化默认选项 */
exports.EINE_DEFAULT_OPTIONS = {
    adapters: {},
    appDirectory: './workspace',
    botName: exports.EINE,
    mongoConfig: {},
    enableConcurrent: false,
    enableDatabase: true,
    enableMessageLog: false,
    enableServer: true,
    enableVerify: true,
    logLevel: types_1.LogLevel.INFO,
    maxConcurrentNumber: 4,
    messageBatchCount: 10,
    messagePullingMode: types_1.MessagePullingMode.PASSIVE_WS,
    pollInterval: 50,
    qq: -1,
    responseTimeout: 5000,
    singleMode: false,
    server: {
        host: '0.0.0.0',
        port: 9119,
    },
    verifyKey: '',
};
//# sourceMappingURL=constant.js.map