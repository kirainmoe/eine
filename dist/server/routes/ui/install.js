"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function install({ res, server }) {
    server.generateMagicToken();
    res.json({
        code: 200,
        status: "success",
        message: "`magic_token` refreshed"
    });
}
exports.default = {
    handler: install,
    validator: [],
};
//# sourceMappingURL=install.js.map