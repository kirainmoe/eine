"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function info({ res, server, eine }) {
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
exports.default = {
    handler: info,
    validator: []
};
//# sourceMappingURL=info.js.map