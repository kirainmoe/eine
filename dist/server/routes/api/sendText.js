"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const authenticate_1 = __importDefault(require("../../flow/authenticate"));
const types_1 = require("../../../common/types");
const component_1 = require("../../../common/component");
async function sendText({ req, res, eine, server, db }) {
    await server.ensureInstalled(res);
    if (await authenticate_1.default(req, res, db)) {
        const messageChain = [
            component_1.Plain(req.body.text),
        ];
        let id = -1;
        switch (req.body.type) {
            case types_1.MessageTypeStr.FRIEND_MESSAGE:
                id = await eine.pickBest().sendFriendMessage(req.body.target, messageChain);
                break;
            case types_1.MessageTypeStr.GROUP_MESSAGE:
                id = await eine.pickBest().sendGroupMessage(req.body.target, messageChain);
                break;
            case types_1.MessageTypeStr.TEMP_MESSAGE:
                id = await eine.pickBest().sendTempMessage(req.body.group, req.body.target, messageChain);
                break;
            default:
                break;
        }
        res.status(200).json({
            code: 0,
            status: "success",
            payload: id,
        });
    }
}
exports.default = {
    handler: sendText,
    validator: [
        express_validator_1.check("authorization")
            .trim()
            .isString()
            .bail(),
        express_validator_1.check("uid")
            .isInt()
            .withMessage("`uid` should be numeric")
            .bail(),
        express_validator_1.check("text")
            .isString()
            .bail(),
        express_validator_1.check("target")
            .isInt()
            .bail(),
        express_validator_1.check("type")
            .isIn(types_1.messageEventType)
            .bail()
    ]
};
//# sourceMappingURL=sendText.js.map