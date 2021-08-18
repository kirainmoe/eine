"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ws = exports.panel = exports.api = void 0;
var apiInstall = __importStar(require("./api/install"));
var apiPublicInfo = __importStar(require("./api/publicInfo"));
var apiLogin = __importStar(require("./api/login"));
var apiAccountInfo = __importStar(require("./api/accountInfo"));
var apiGroupInfo = __importStar(require("./api/groupInfo"));
var apiSendText = __importStar(require("./api/sendText"));
var magic_1 = __importDefault(require("./api/magic"));
var panelInstall = __importStar(require("./panel/install"));
exports.api = {
    accountInfo: apiAccountInfo.default,
    install: apiInstall.default,
    groupInfo: apiGroupInfo.default,
    login: apiLogin.default,
    publicInfo: apiPublicInfo.default,
    sendText: apiSendText.default,
    magic: magic_1.default,
};
exports.panel = {
    install: panelInstall.default,
};
exports.ws = __importStar(require("./ws"));
//# sourceMappingURL=index.js.map