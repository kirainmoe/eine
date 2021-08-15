"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
async function authenticate(req, res, db) {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            code: 400,
            status: 'failed',
            message: 'bad request',
            errors: errors.array(),
        });
        return false;
    }
    const authResult = await db.authenticate(req.body.uid, req.headers.authorization);
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
exports.default = authenticate;
//# sourceMappingURL=authenticate.js.map