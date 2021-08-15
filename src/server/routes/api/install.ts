import { body, validationResult } from 'express-validator';

import { EineUserRole } from '../../../common/types';
import { EineRouteHandlerType } from "../types";

// `/api/install`
async function install({ req, res, logger, db, server }: EineRouteHandlerType) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      code: 400,
      status: 'failed',
      message: 'bad request',
      errors: errors.array(),
    });
  }

  const isInstalled = await db.countUser({ role: 0 });
  if (isInstalled > 0) {
    return res.redirect("/login");
  }

  if (!server.compareMagicToken(req.body.magic_token)) {
    return res.status(403).json({
      code: 403,
      status: 'failed',
      message: 'invalid `magic_token`',
    });
  }
  server.expireMagicToken();

  const { username, password } = req.body;
  await db.createUser(username, password, EineUserRole.MASTER);

  return res.status(200).json({
    code: 0,
    status: 'success',
    message: 'superuser created',
  });
}

export default {
  handler: install,
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
    body("magic_token")
      .trim()
      .isString()
      .withMessage("`magic_token` should be string.")
      .isLength({ max: 10, min: 10 })
      .withMessage("invalid `magic_token` length")
      .bail()
  ]
}
