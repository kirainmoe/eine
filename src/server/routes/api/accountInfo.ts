import { check } from "express-validator";
import authenticate from "../../flow/authenticate";
import { EineRouteHandlerType } from "../types";

async function accountInfo({ req, res, eine, db, server }: EineRouteHandlerType) {
  await server.ensureInstalled(res);
  if (await authenticate(req, res, db)) {
    const profile = await eine.pickBest().botProfile();
    const friendList = await eine.pickBest().friendList();
    const groupList = await eine.pickBest().groupList();

    res.status(200).json({
      code: 0,
      status: "success",
      payload: {
        qq: eine.getOption("qq"),
        profile,
        friendList,
        groupList,
      }
    });
  }
}

export default {
  handler: accountInfo,
  validator: [
    check("authorization")
      .trim()
      .isString()
      .bail(),
    check("uid")
      .isInt()
      .withMessage("`uid` should be numeric")
      .bail()
  ]
}