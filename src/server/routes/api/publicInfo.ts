import { EineRouteHandlerType } from "../types";

async function publicInfo({ res, server, eine }: EineRouteHandlerType) {
  res.status(200).json({
    code: 0,
    status: "success",
    message: "",
    payload: {
      botName: eine.getOption("botName"),
      version: eine.getVersion(),
    }
  });
}

export default {
  handler: publicInfo,
  validator: []
}