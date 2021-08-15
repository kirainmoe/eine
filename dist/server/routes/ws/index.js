"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushMessage = void 0;
const crypto_1 = require("crypto");
const uuid_1 = require("uuid");
const authorizedTokens = new Map();
const authorizedTokensReverseMap = new Map();
const authorizedSessions = new Map();
const tokenRefresher = new Map();
const genToken = () => {
    const token = crypto_1.createHash('md5').update(uuid_1.v4()).digest('hex');
    return token;
};
const requestRefreshToken = (authorization) => {
    const oldToken = authorizedTokens.get(authorization);
    if (!oldToken) {
        return;
    }
    const wsSession = authorizedSessions.get(oldToken);
    if (!wsSession) {
        return;
    }
    tokenRefresher.delete(oldToken);
    authorizedTokensReverseMap.delete(oldToken);
    authorizedSessions.delete(oldToken);
    const newToken = genToken();
    authorizedTokens.set(authorization, newToken);
    authorizedSessions.set(newToken, wsSession);
    tokenRefresher.set(newToken, setTimeout(() => requestRefreshToken(authorization), 20 * 60 * 1000));
    wsSession.bindToken = newToken;
    wsSession.send(JSON.stringify({
        code: 0,
        type: "RefreshToken",
        token: newToken,
    }));
};
const releaseConnection = (bindToken) => {
    const authorization = authorizedTokens.get(bindToken);
    const reverse = authorizedTokensReverseMap.get(authorization);
    if (reverse !== bindToken)
        return;
    authorizedTokens.delete(authorization);
    authorizedTokensReverseMap.delete(bindToken);
    authorizedSessions.delete(bindToken);
    const pendingTimeout = tokenRefresher.get(bindToken);
    if (pendingTimeout) {
        clearTimeout(pendingTimeout);
    }
    tokenRefresher.delete(bindToken);
};
const pushMessage = ({ type, sender, messageChain, str }) => {
    authorizedSessions.forEach(session => {
        session.send(JSON.stringify({
            type,
            sender,
            messageChain,
            str,
        }));
    });
};
exports.pushMessage = pushMessage;
function websocketHandler({ ws, eine, server, db, logger }) {
    ws.on('message', async (msg) => {
        let message;
        try {
            message = JSON.parse(msg.toString());
        }
        catch (err) {
            logger.warn("Parse message payload failed, message: {}..., {}", msg.toString().slice(0, 100), err);
            return;
        }
        if (message.type === "authenticate") {
            if (!message.authorization || !message.uid)
                return;
            const hasUser = await db.authenticate(message.uid, message.authorization);
            if (!hasUser) {
                ws.send(JSON.stringify({
                    code: 403,
                    status: "failed",
                    message: "authentication failed",
                }), () => ws.close());
                return;
            }
            const newToken = genToken();
            authorizedTokens.set(message.authorization, newToken);
            authorizedTokensReverseMap.set(newToken, message.authorization);
            authorizedSessions.set(newToken, ws);
            tokenRefresher.set(newToken, setTimeout(() => requestRefreshToken(message.authorization), 20 * 60 * 1000));
            ws.bindToken = newToken;
            ws.authorized = true;
            ws.send(JSON.stringify({
                code: 0,
                type: "AuthSuccess",
                token: newToken,
            }));
            return;
        }
        if (ws.authorized === false) {
            ws.close();
            return;
        }
    });
    ws.on('close', async () => {
        const bindToken = ws.bindToken;
        if (bindToken)
            releaseConnection(bindToken);
    });
    ws.on('error', async (err) => {
        const bindToken = ws.bindToken;
        if (bindToken)
            releaseConnection(bindToken);
        logger.error("websocket error: {} {}", err, bindToken ? `(session: ${bindToken})` : '');
    });
}
exports.default = websocketHandler;
//# sourceMappingURL=index.js.map