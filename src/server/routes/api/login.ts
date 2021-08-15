import { body, validationResult } from "express-validator";
import { EineRouteHandlerType } from "../types";

async function login({ req, res, logger, db, server }: EineRouteHandlerType) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      code: 400,
      status: 'failed',
      message: 'bad request',
      errors: errors.array(),
    });
  }

  await server.ensureInstalled(res);
  const { username, password } = req.body;
  const result = await db.login(username, password);
  if (!result) {
    res.status(403).json({
      code: 403,
      status: "failed",
      message: "invalid `username` or `password`."
    });
    return;
  }

  res.status(200).json({
    code: 0,
    status: "success",
    message: "",
    payload: {
      username,
      ...result,
    },
  });
}

export default {
  handler: login,
  validator: [
    body("username")
      .trim()
      .isString()
      .withMessage("`username` should be string.")
      .isLength({ max: 100, min: 1 })
      .withMessage("`username` should have length [1, 100]")
      .bail(),
    body("password")
      .trim()
      .isString()
      .withMessage("`password` should be string.")
      .isLength({ max: 32, min: 32 })
      .withMessage("invalid `password`")
      .bail(),
  ]
}