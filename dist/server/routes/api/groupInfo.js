"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const authenticate_1 = __importDefault(require("../../flow/authenticate"));
async function groupInfo({ req, res, eine, server, db }) {
    await server.ensureInstalled(res);
    if (await authenticate_1.default(req, res, db)) {
        const groupInfo = await eine.pickBest().getGroupConfig(req.query.groupId);
        res.status(200).json({
            code: 0,
            status: "success",
            payload: {
                ...groupInfo,
                members: await eine.pickBest().memberList(req.query.groupId),
            }
        });
    }
}
exports.default = {
    handler: groupInfo,
    validator: [
        express_validator_1.check("authorization")
            .trim()
            .isString()
            .bail(),
        express_validator_1.check("uid")
            .isInt()
            .withMessage("`uid` should be numeric")
            .bail(),
        express_validator_1.check("groupId")
            .isInt()
            .bail()
    ]
};
//# sourceMappingURL=groupInfo.js.map