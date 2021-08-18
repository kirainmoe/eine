"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClusterRole = exports.EineUserRole = exports.EineEventTypeStr = exports.EventHandleResult = exports.MessagePullingMode = exports.LogLevel = void 0;
/** mirai-api-http 适配器 */
/** 支持的适配器类型 = {HTTP, WS} */
var AdapterType;
(function (AdapterType) {
    AdapterType["HTTP"] = "http";
    AdapterType["WS"] = "ws";
})(AdapterType || (AdapterType = {}));
/** 日志等级 = {VERBOSE, INFO, WARNING, ERROR, NONE} */
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["VERBOSE"] = 0] = "VERBOSE";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARNING"] = 2] = "WARNING";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
    LogLevel[LogLevel["NONE"] = 4] = "NONE";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
/** 信息拉取方式  = {POLLING, PASSIVE_WS} */
var MessagePullingMode;
(function (MessagePullingMode) {
    /** 使用 HTTP Adapter 主动拉取接口 */
    MessagePullingMode[MessagePullingMode["POLLING"] = 0] = "POLLING";
    /** 使用 Websocket Client 模式与服务器建立连接获取推送 */
    MessagePullingMode[MessagePullingMode["PASSIVE_WS"] = 1] = "PASSIVE_WS";
})(MessagePullingMode = exports.MessagePullingMode || (exports.MessagePullingMode = {}));
/** 事件处理结果 */
var EventHandleResult;
(function (EventHandleResult) {
    EventHandleResult[EventHandleResult["DONE"] = 0] = "DONE";
    EventHandleResult[EventHandleResult["CONTINUE"] = 1] = "CONTINUE";
})(EventHandleResult = exports.EventHandleResult || (exports.EventHandleResult = {}));
/** Eine 框架自有事件类型 */
var EineEventTypeStr;
(function (EineEventTypeStr) {
    EineEventTypeStr["MESSAGE"] = "Message";
    EineEventTypeStr["SEND_MESSAGE"] = "SendMessage";
    EineEventTypeStr["BEFORE_VERIFY"] = "BeforeVerify";
    EineEventTypeStr["AFTER_VERIFY"] = "AfterVerify";
    EineEventTypeStr["BEFORE_BIND"] = "BeforeBind";
    EineEventTypeStr["AFTER_BIND"] = "AfterBind";
    EineEventTypeStr["AFTER_HTTP_VERIFY"] = "AfterHttpVerify";
    EineEventTypeStr["AFTER_HTTP_BIND"] = "AfterHttpBind";
    EineEventTypeStr["AFTER_MONGO_CONNECTED"] = "AfterMongoConnected";
    EineEventTypeStr["AFTER_MONGO_CLOSE"] = "AfterMongoClose";
    EineEventTypeStr["AFTER_SERVER_START"] = "AfterServerStart";
    EineEventTypeStr["PROCESS_MESSAGE"] = "ProcessMessage";
})(EineEventTypeStr = exports.EineEventTypeStr || (exports.EineEventTypeStr = {}));
/** Eine 用户角色类型 { MASTER, ADMINISTRATOR, USER } */
var EineUserRole;
(function (EineUserRole) {
    EineUserRole[EineUserRole["MASTER"] = 0] = "MASTER";
    EineUserRole[EineUserRole["ADMINISTRATOR"] = 1] = "ADMINISTRATOR";
    EineUserRole[EineUserRole["USER"] = 2] = "USER";
})(EineUserRole = exports.EineUserRole || (exports.EineUserRole = {}));
/** Eine Concurrency Mode: 集群角色 */
var ClusterRole;
(function (ClusterRole) {
    ClusterRole[ClusterRole["PRIMARY"] = 0] = "PRIMARY";
    ClusterRole[ClusterRole["SECONDARY"] = 1] = "SECONDARY";
})(ClusterRole = exports.ClusterRole || (exports.ClusterRole = {}));
//# sourceMappingURL=EineType.js.map