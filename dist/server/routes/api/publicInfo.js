"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function publicInfo({ res, server, eine }) {
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
    handler: publicInfo,
    validator: []
};
//# sourceMappingURL=publicInfo.js.map