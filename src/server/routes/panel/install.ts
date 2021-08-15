import * as path from "path";
import { EineRouteHandlerType } from "../types";

async function install({ res, server, db }: EineRouteHandlerType) {
  const isInstalled = await db.countUser({ role: 0 });
  if (isInstalled > 0) {
    return res.redirect("/login");
  }

  server.generateMagicToken();
  res.sendFile(path.join(path.dirname(path.dirname(__dirname)), "build", "index.html"));
}

export default {
  handler: install,
  validator: [],
};
