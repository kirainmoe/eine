"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const authenticate_1 = __importDefault(require("../../flow/authenticate"));
async function accountInfo({ req, res, eine, db, server }) {
    await server.ensureInstalled(res);
    if (await authenticate_1.default(req, res, db)) {
        const profile = await eine.pickBest().botProfile();
        const friendList = await eine.pickBest().friendList();
        const groupList = await eine.pickBest().groupList();
        res.status(200).json({
            code: 0,
            status: "success",
            payload: {
                qq: eine.getOption("qq"),
                profile,
                friendList,
                groupList,
            }
        });
    }
}
exports.default = {
    handler: accountInfo,
    validator: [
        express_validator_1.check("authorization")
            .trim()
            .isString()
            .bail(),
        express_validator_1.check("uid")
            .isInt()
            .withMessage("`uid` should be numeric")
            .bail()
    ]
};
//# sourceMappingURL=accountInfo.js.map