import { createHash } from 'crypto';
import { v4 } from 'uuid';
import * as ws from 'ws';
import { MessageTypeStr, SenderType } from '../../../common/types';
import { MessageChain } from "../../../common/types/MessageComponentType";
import { EineWebsocketHandlerType } from "../types";

const authorizedTokens = new Map<string, string>();
const authorizedTokensReverseMap = new Map<string, string>();
const authorizedSessions = new Map<string, ws>();
const tokenRefresher = new Map<string, NodeJS.Timeout>();

const genToken = () => {
  const token = createHash('md5').update(v4()).digest('hex');
  return token;
}

const requestRefreshToken = (authorization: string) => {
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
  (wsSession as any).bindToken = newToken;

  wsSession.send(JSON.stringify({
    code: 0,
    type: "RefreshToken",
    token: newToken,
  }));
};

const releaseConnection = (bindToken: string) => {
  const authorization = authorizedTokens.get(bindToken)!;
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
}

export const pushMessage = ({ type, sender, messageChain, str }: {
  type: MessageTypeStr,
  sender: SenderType,
  messageChain: MessageChain,
  str: string,
}) => {
  authorizedSessions.forEach(session => {
    session.send(JSON.stringify({
      type,
      sender,
      messageChain,
      str,
    }));
  });
};

export default function websocketHandler({ ws, eine, server, db, logger }: EineWebsocketHandlerType) {
  ws.on('message', async (msg) => {
    let message: any;
    try {
      message = JSON.parse(msg.toString());
    } catch(err) {
      logger.warn("Parse message payload failed, message: {}..., {}",  msg.toString().slice(0, 100), err);
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

      (ws as any).bindToken = newToken;
      (ws as any).authorized = true;
      ws.send(JSON.stringify({
        code: 0,
        type: "AuthSuccess",
        token: newToken,
      }));
      return;
    }

    if ((ws as any).authorized === false) {
      ws.close();
      return;
    }
  });

  ws.on('close', async() => {
    const bindToken = (ws as any).bindToken;
    if (bindToken)
      releaseConnection(bindToken);
  });

  ws.on('error', async(err) => {
    const bindToken = (ws as any).bindToken;
    if (bindToken)
      releaseConnection(bindToken);
    logger.error("websocket error: {} {}", err, bindToken ? `(session: ${bindToken})` : '');
  });
}