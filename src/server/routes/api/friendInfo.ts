import authenticate from "../../flow/authenticate";
import { EineRouteHandlerType } from "../types";
import { check } from "express-validator";

async function friendInfo({ req, res, eine, server, db }: EineRouteHandlerType) {
  await server.ensureInstalled(res);
  if (await authenticate(req, res, db)) {
    const friendInfo = await eine.pickBest().friendProfile(req.query.friendId);

    res.status(200).json({
      code: 0,
      status: "success",
      payload: friendInfo,
    });
  }
}

export default {
  handler: friendInfo,
  validator: [
    check("authorization")
      .trim()
      .isString()
      .bail(),
    check("uid")
      .isInt()
      .bail(),
    check("friendId")
      .isInt()
      .bail()
  ]
}