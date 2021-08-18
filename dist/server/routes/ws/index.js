"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushMessage = void 0;
var crypto_1 = require("crypto");
var uuid_1 = require("uuid");
var authorizedTokens = new Map();
var authorizedTokensReverseMap = new Map();
var authorizedSessions = new Map();
var tokenRefresher = new Map();
var genToken = function () {
    var token = crypto_1.createHash('md5').update(uuid_1.v4()).digest('hex');
    return token;
};
var requestRefreshToken = function (authorization) {
    var oldToken = authorizedTokens.get(authorization);
    if (!oldToken) {
        return;
    }
    var wsSession = authorizedSessions.get(oldToken);
    if (!wsSession) {
        return;
    }
    tokenRefresher.delete(oldToken);
    authorizedTokensReverseMap.delete(oldToken);
    authorizedSessions.delete(oldToken);
    var newToken = genToken();
    authorizedTokens.set(authorization, newToken);
    authorizedSessions.set(newToken, wsSession);
    tokenRefresher.set(newToken, setTimeout(function () { return requestRefreshToken(authorization); }, 20 * 60 * 1000));
    wsSession.bindToken = newToken;
    wsSession.send(JSON.stringify({
        code: 0,
        type: "RefreshToken",
        token: newToken,
    }));
};
var releaseConnection = function (bindToken) {
    var authorization = authorizedTokens.get(bindToken);
    var reverse = authorizedTokensReverseMap.get(authorization);
    if (reverse !== bindToken)
        return;
    authorizedTokens.delete(authorization);
    authorizedTokensReverseMap.delete(bindToken);
    authorizedSessions.delete(bindToken);
    var pendingTimeout = tokenRefresher.get(bindToken);
    if (pendingTimeout) {
        clearTimeout(pendingTimeout);
    }
    tokenRefresher.delete(bindToken);
};
var pushMessage = function (_a) {
    var type = _a.type, sender = _a.sender, messageChain = _a.messageChain, str = _a.str;
    authorizedSessions.forEach(function (session) {
        session.send(JSON.stringify({
            type: type,
            sender: sender,
            messageChain: messageChain,
            str: str,
        }));
    });
};
exports.pushMessage = pushMessage;
function websocketHandler(_a) {
    var _this = this;
    var ws = _a.ws, eine = _a.eine, server = _a.server, db = _a.db, logger = _a.logger;
    ws.on('message', function (msg) { return __awaiter(_this, void 0, void 0, function () {
        var message, hasUser, newToken;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    try {
                        message = JSON.parse(msg.toString());
                    }
                    catch (err) {
                        logger.warn("Parse message payload failed, message: {}..., {}", msg.toString().slice(0, 100), err);
                        return [2 /*return*/];
                    }
                    if (!(message.type === "authenticate")) return [3 /*break*/, 2];
                    if (!message.authorization || !message.uid)
                        return [2 /*return*/];
                    return [4 /*yield*/, db.authenticate(message.uid, message.authorization)];
                case 1:
                    hasUser = _a.sent();
                    if (!hasUser) {
                        ws.send(JSON.stringify({
                            code: 403,
                            status: "failed",
                            message: "authentication failed",
                        }), function () { return ws.close(); });
                        return [2 /*return*/];
                    }
                    newToken = genToken();
                    authorizedTokens.set(message.authorization, newToken);
                    authorizedTokensReverseMap.set(newToken, message.authorization);
                    authorizedSessions.set(newToken, ws);
                    tokenRefresher.set(newToken, setTimeout(function () { return requestRefreshToken(message.authorization); }, 20 * 60 * 1000));
                    ws.bindToken = newToken;
                    ws.authorized = true;
                    ws.send(JSON.stringify({
                        code: 0,
                        type: "AuthSuccess",
                        token: newToken,
                    }));
                    return [2 /*return*/];
                case 2:
                    if (ws.authorized === false) {
                        ws.close();
                        return [2 /*return*/];
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    ws.on('close', function () { return __awaiter(_this, void 0, void 0, function () {
        var bindToken;
        return __generator(this, function (_a) {
            bindToken = ws.bindToken;
            if (bindToken)
                releaseConnection(bindToken);
            return [2 /*return*/];
        });
    }); });
    ws.on('error', function (err) { return __awaiter(_this, void 0, void 0, function () {
        var bindToken;
        return __generator(this, function (_a) {
            bindToken = ws.bindToken;
            if (bindToken)
                releaseConnection(bindToken);
            logger.error("websocket error: {} {}", err, bindToken ? "(session: " + bindToken + ")" : '');
            return [2 /*return*/];
        });
    }); });
}
exports.default = websocketHandler;
//# sourceMappingURL=index.js.map