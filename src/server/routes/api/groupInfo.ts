import { EineRouteHandlerType } from "../types";
import { check } from "express-validator";

import authenticate from "../../flow/authenticate";

async function groupInfo({ req, res, eine, server, db }: EineRouteHandlerType) {
  await server.ensureInstalled(res);
  if (await authenticate(req, res, db)) {
    const groupInfo = await eine.pickBest().getGroupConfig(req.query.groupId);

    res.status(200).json({
      code: 0,
      status: "success",
      payload: {
        ...groupInfo,
        members: await eine.pickBest().memberList(req.query.groupId),
      }
    });
  }
}

export default {
  handler: groupInfo,
  validator: [
    check("authorization")
      .trim()
      .isString()
      .bail(),
    check("uid")
      .isInt()
      .withMessage("`uid` should be numeric")
      .bail(),
    check("groupId")
      .isInt()
      .bail()
  ]
}
