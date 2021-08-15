"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const types_1 = require("../../../common/types");
// `/api/install`
async function install({ req, res, logger, db, server }) {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            code: 400,
            status: 'failed',
            message: 'bad request',
            errors: errors.array(),
        });
    }
    const isInstalled = await db.countUser({ role: 0 });
    if (isInstalled > 0) {
        return res.redirect("/login");
    }
    if (!server.compareMagicToken(req.body.magic_token)) {
        return res.status(403).json({
            code: 403,
            status: 'failed',
            message: 'invalid `magic_token`',
        });
    }
    server.expireMagicToken();
    const { username, password } = req.body;
    await db.createUser(username, password, types_1.EineUserRole.MASTER);
    return res.status(200).json({
        code: 0,
        status: 'success',
        message: 'superuser created',
    });
}
exports.default = {
    handler: install,
    validator: [
        express_validator_1.body("username")
            .trim()
            .isString()
            .withMessage("`username` should be string.")
            .isLength({ max: 100, min: 1 })
            .withMessage("`username` should have length [1, 100]")
            .bail(),
        express_validator_1.body("password")
            .trim()
            .isString()
            .withMessage("`password` should be string.")
            .isLength({ max: 32, min: 32 })
            .withMessage("invalid `password`")
            .bail(),
        express_validator_1.body("magic_token")
            .trim()
            .isString()
            .withMessage("`magic_token` should be string.")
            .isLength({ max: 10, min: 10 })
            .withMessage("invalid `magic_token` length")
            .bail()
    ]
};
//# sourceMappingURL=install.js.map