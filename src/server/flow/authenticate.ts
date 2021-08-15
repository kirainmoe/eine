import { Request, Response } from "express";
import { validationResult } from "express-validator";

import EineDB from "../../libs/db/EineDB";

async function authenticate(req: Request, res: Response, db: EineDB) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      code: 400,
      status: 'failed',
      message: 'bad request',
      errors: errors.array(),
    });
    return false;
  }
  
  const authResult = await db.authenticate(req.body.uid, req.headers.authorization!);
  if (!authResult) {
    res.status(403).json({
      code: 403,
      status: "failed",
      message: "authorization failed",
    });
    return false;
  }
  return true;
}

export default authenticate;
