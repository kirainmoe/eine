"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function echo({ res, server, eine }) {
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
    handler: echo,
    validator: []
};
//# sourceMappingURL=echo.js.map