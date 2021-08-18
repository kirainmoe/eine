"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_validator_1 = require("express-validator");
var types_1 = require("../../../common/types");
var component_1 = require("../../../common/component");
var authenticate_1 = __importDefault(require("../../flow/authenticate"));
function sendText(_a) {
    var req = _a.req, res = _a.res, eine = _a.eine, server = _a.server, db = _a.db;
    return __awaiter(this, void 0, void 0, function () {
        var messageChain, id, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, server.ensureInstalled(res)];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, authenticate_1.default(req, res, db)];
                case 2:
                    if (!_c.sent()) return [3 /*break*/, 11];
                    messageChain = [
                        component_1.Plain(req.body.text),
                    ];
                    id = -1;
                    _b = req.body.type;
                    switch (_b) {
                        case types_1.MessageTypeStr.FRIEND_MESSAGE: return [3 /*break*/, 3];
                        case types_1.MessageTypeStr.GROUP_MESSAGE: return [3 /*break*/, 5];
                        case types_1.MessageTypeStr.TEMP_MESSAGE: return [3 /*break*/, 7];
                    }
                    return [3 /*break*/, 9];
                case 3: return [4 /*yield*/, eine.pickBest().sendFriendMessage(req.body.target, messageChain)];
                case 4:
                    id = _c.sent();
                    return [3 /*break*/, 10];
                case 5: return [4 /*yield*/, eine.pickBest().sendGroupMessage(req.body.target, messageChain)];
                case 6:
                    id = _c.sent();
                    return [3 /*break*/, 10];
                case 7: return [4 /*yield*/, eine.pickBest().sendTempMessage(req.body.group, req.body.target, messageChain)];
                case 8:
                    id = _c.sent();
                    return [3 /*break*/, 10];
                case 9: return [3 /*break*/, 10];
                case 10:
                    res.status(200).json({
                        code: 0,
                        status: "success",
                        payload: id,
                    });
                    _c.label = 11;
                case 11: return [2 /*return*/];
            }
        });
    });
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