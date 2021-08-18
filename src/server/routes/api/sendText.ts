import { EineRouteHandlerType } from "../types";
import { check } from "express-validator";

import { messageEventType, MessageTypeStr } from "../../../common/types";
import { MessageChain } from "../../../common/types/MessageComponentType";
import { Plain } from "../../../common/component";

import authenticate from "../../flow/authenticate";

async function sendText({ req, res, eine, server, db }: EineRouteHandlerType) {
  await server.ensureInstalled(res);
  if (await authenticate(req, res, db)) {
    const messageChain: MessageChain = [
      Plain(req.body.text),
    ];
    let id: number = -1;
    switch (req.body.type) {
      case MessageTypeStr.FRIEND_MESSAGE:
        id = await eine.pickBest().sendFriendMessage(req.body.target, messageChain);
        break;
      case MessageTypeStr.GROUP_MESSAGE:
        id = await eine.pickBest().sendGroupMessage(req.body.target, messageChain);
        break;
      case MessageTypeStr.TEMP_MESSAGE:
        id = await eine.pickBest().sendTempMessage(req.body.group, req.body.target,  messageChain);
        break;
      default:
        break;
    }

    res.status(200).json({
      code: 0,
      status: "success",
      payload: id,
    });
  }
}

export default {
  handler: sendText,
  validator: [
    check("authorization")
      .trim()
      .isString()
      .bail(),
    check("uid")
      .isInt()
      .withMessage("`uid` should be numeric")
      .bail(),
    check("text")
      .isString()
      .bail(),
    check("target")
      .isInt()
      .bail(),
    check("type")
      .isIn(messageEventType)
      .bail()
  ]
}
