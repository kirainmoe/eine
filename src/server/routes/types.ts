import Eine from "../..";
import EineServer from "..";
import EineDB from "../../libs/db/EineDB";
import EineLogger from "../../libs/logger";

import * as ws from "ws";

import { Request, Response } from "express";

export interface EineRouteHandlerType {
  req: Request;
  res: Response;
  eine: Eine;
  logger: EineLogger;
  db: EineDB;
  server: EineServer;
}

export interface EineWebsocketHandlerType extends EineRouteHandlerType {
  ws: ws;
}