import { EineRouteHandlerType } from "../types";

function magic({ res, server }: EineRouteHandlerType) {
  server.generateMagicToken();
  res.json({
    code: 200,
    status: "success",
    message: "`magic_token` refreshed"
  });
}

export default {
  handler: magic,
  validator: [],
}