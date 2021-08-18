"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cluster_1 = __importDefault(require("cluster"));
var moment_1 = __importDefault(require("moment"));
var chalk_1 = __importDefault(require("chalk"));
var types_1 = require("../../common/types");
var asStr_1 = require("../../utils/asStr");
/**
 * Eine Logger - 日志组件
 */
var EineLogger = /** @class */ (function () {
    function EineLogger(level, prefix) {
        this.clusterPrefix = cluster_1.default.isWorker ? " (Worker " + process.env.EINE_PROCESS_INDEX + ")" : '';
        this.level = level;
        this.prefix = "[" + prefix + this.clusterPrefix + "]";
    }
    /**
     * 获取当前时间格式化字符串
     * @returns string
     */
    EineLogger.prototype.getTimeString = function () {
        return "(" + moment_1.default().format("YYYY-MM-DD HH:mm:ss") + ")";
    };
    /**
     * 格式化字符串
     * @param pattern 字符串模板
     * @param args 值
     * @returns 返回格式化后的字符
     */
    EineLogger.prototype.formatString = function (pattern) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var from = 0;
        var to = 0;
        var index = 0;
        var result = "";
        while (to + 1 < pattern.length && index < args.length) {
            if (pattern[to] === "{" && ((to > 0 && pattern[to - 1] !== "\\") || (to === 0)) && pattern[to + 1] === "}") {
                result = result + pattern.slice(from, to) + asStr_1.asStr(args[index++]);
                from = to += 2;
            }
            else {
                to++;
            }
        }
        if (to < pattern.length) {
            to = pattern.length;
        }
        result = result + pattern.slice(from, to);
        return result;
    };
    EineLogger.prototype.verbose = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.level <= types_1.LogLevel.VERBOSE &&
            console.log(chalk_1.default.bgGrey("VERB"), chalk_1.default.gray(this.prefix), chalk_1.default.gray(this.getTimeString()), this.formatString.apply(this, __spreadArray([message], args)));
    };
    EineLogger.prototype.info = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.level <= types_1.LogLevel.INFO &&
            console.log(chalk_1.default.bgCyan("INFO"), "" + chalk_1.default.cyan(this.prefix), "" + chalk_1.default.gray(this.getTimeString()), this.formatString.apply(this, __spreadArray([message], args)));
    };
    EineLogger.prototype.warn = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.level <= types_1.LogLevel.WARNING &&
            console.log(chalk_1.default.bgYellow("WARN"), "" + chalk_1.default.yellow(this.prefix), "" + chalk_1.default.gray(this.getTimeString()), this.formatString.apply(this, __spreadArray([message], args)));
    };
    EineLogger.prototype.error = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.level <= types_1.LogLevel.ERROR &&
            console.log(chalk_1.default.bgRed("ERR!"), "" + chalk_1.default.red(this.prefix), "" + chalk_1.default.gray(this.getTimeString()), this.formatString.apply(this, __spreadArray([message], args)));
    };
    EineLogger.prototype.success = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.level <= types_1.LogLevel.INFO &&
            console.log(chalk_1.default.bgGreen("SUCC"), "" + chalk_1.default.green(this.prefix), "" + chalk_1.default.gray(this.getTimeString()), this.formatString.apply(this, __spreadArray([message], args)));
    };
    EineLogger.prototype.tips = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.level <= types_1.LogLevel.INFO &&
            console.log(chalk_1.default.bgMagenta("TIPS"), chalk_1.default.magenta(this.prefix), chalk_1.default.gray(this.getTimeString()), this.formatString.apply(this, __spreadArray([message], args)));
    };
    EineLogger.prototype.message = function (sender, message) {
        console.log(chalk_1.default.bgWhite("MESG"), chalk_1.default.gray("<" + sender + " " + this.clusterPrefix + ">"), chalk_1.default.gray(this.getTimeString()), message);
    };
    EineLogger.prototype.essentialInfo = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        console.log(chalk_1.default.bgCyan("INFO"), "" + chalk_1.default.gray(this.prefix), "" + chalk_1.default.gray(this.getTimeString()), this.formatString.apply(this, __spreadArray([message], args)));
    };
    return EineLogger;
}());
exports.default = EineLogger;
//# sourceMappingURL=EineLogger.js.map