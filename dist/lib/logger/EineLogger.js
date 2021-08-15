"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const chalk_1 = __importDefault(require("chalk"));
const types_1 = require("../../common/types");
const asStr_1 = require("../../utils/asStr");
/**
 * Eine Logger - 日志组件
 */
class EineLogger {
    level;
    prefix;
    constructor(level, prefix) {
        this.level = level;
        this.prefix = `[${prefix}]`;
    }
    /**
     * 获取当前时间格式化字符串
     * @returns string
     */
    getTimeString() {
        return `(${moment_1.default().format("YYYY-MM-DD HH:mm:ss")})`;
    }
    /**
     * 格式化字符串
     * @param pattern 字符串模板
     * @param args 值
     * @returns 返回格式化后的字符
     */
    formatString(pattern, ...args) {
        let from = 0;
        let to = 0;
        let index = 0;
        let result = "";
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
    }
    verbose(message, ...args) {
        this.level <= types_1.LogLevel.VERBOSE &&
            console.log(chalk_1.default.bgGrey("VERB"), chalk_1.default.gray(this.prefix), chalk_1.default.gray(this.getTimeString()), this.formatString(message, ...args));
    }
    info(message, ...args) {
        this.level <= types_1.LogLevel.INFO &&
            console.log(chalk_1.default.bgCyan("INFO"), `${chalk_1.default.cyan(this.prefix)}`, `${chalk_1.default.gray(this.getTimeString())}`, this.formatString(message, ...args));
    }
    warn(message, ...args) {
        this.level <= types_1.LogLevel.WARNING &&
            console.log(chalk_1.default.bgYellow("WARN"), `${chalk_1.default.yellow(this.prefix)}`, `${chalk_1.default.gray(this.getTimeString())}`, this.formatString(message, ...args));
    }
    error(message, ...args) {
        this.level <= types_1.LogLevel.ERROR &&
            console.log(chalk_1.default.bgRed("ERR!"), `${chalk_1.default.red(this.prefix)}`, `${chalk_1.default.gray(this.getTimeString())}`, this.formatString(message, ...args));
    }
    success(message, ...args) {
        this.level <= types_1.LogLevel.INFO &&
            console.log(chalk_1.default.bgGreen("SUCC"), `${chalk_1.default.green(this.prefix)}`, `${chalk_1.default.gray(this.getTimeString())}`, this.formatString(message, ...args));
    }
    tips(message, ...args) {
        this.level <= types_1.LogLevel.INFO &&
            console.log(chalk_1.default.bgMagenta("TIPS"), chalk_1.default.magenta(this.prefix), chalk_1.default.gray(this.getTimeString()), this.formatString(message, ...args));
    }
    message(sender, message) {
        console.log(chalk_1.default.bgWhite("MESG"), chalk_1.default.gray(`<${sender}>`), chalk_1.default.gray(this.getTimeString()), message);
    }
}
exports.default = EineLogger;
//# sourceMappingURL=EineLogger.js.map