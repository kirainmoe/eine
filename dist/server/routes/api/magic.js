"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function magic({ res, server }) {
    server.generateMagicToken();
    res.json({
        code: 200,
        status: "success",
        message: "`magic_token` refreshed"
    });
}
exports.default = {
    handler: magic,
    validator: [],
};
//# sourceMappingURL=magic.js.map