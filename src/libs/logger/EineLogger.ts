import moment from "moment";
import chalk from "chalk";

import { LogLevel } from "../../common/types";
import { asStr } from "../../utils/asStr";

/**
 * Eine Logger - 日志组件
 */
export default class EineLogger {
  private level: LogLevel;
  private prefix: string;

  constructor(level: LogLevel, prefix: string) {
    this.level = level;
    this.prefix = `[${prefix}]`;
  }

  /**
   * 获取当前时间格式化字符串
   * @returns string
   */
  public getTimeString(): string {
    return `(${moment().format("YYYY-MM-DD HH:mm:ss")})`;
  }

  /**
   * 格式化字符串
   * @param pattern 字符串模板
   * @param args 值
   * @returns 返回格式化后的字符
   */
  public formatString(pattern: string, ...args: any[]): string {
    let from = 0;
    let to = 0;
    let index = 0;
    let result = "";

    while (to + 1 < pattern.length && index < args.length) {
      if (pattern[to] === "{" && ((to > 0 && pattern[to - 1] !== "\\") || (to === 0)) && pattern[to + 1] === "}") {
        result = result + pattern.slice(from, to) + asStr(args[index++]);
        from = to += 2;
      } else {
        to++;
      }
    }

    if (to < pattern.length) {
      to = pattern.length;
    }

    result = result + pattern.slice(from, to);
    return result;
  }

  public verbose(message: string, ...args: any[]) {
    this.level <= LogLevel.VERBOSE &&
      console.log(
        chalk.bgGrey("VERB"),
        chalk.gray(this.prefix),
        chalk.gray(this.getTimeString()),
        this.formatString(message, ...args)
      );
  }

  public info(message: string, ...args: any[]) {
    this.level <= LogLevel.INFO &&
      console.log(
        chalk.bgCyan("INFO"),
        `${chalk.cyan(this.prefix)}`,
        `${chalk.gray(this.getTimeString())}`,
        this.formatString(message, ...args)
      );
  }

  public warn(message: string, ...args: any[]) {
    this.level <= LogLevel.WARNING &&
      console.log(
        chalk.bgYellow("WARN"),
        `${chalk.yellow(this.prefix)}`,
        `${chalk.gray(this.getTimeString())}`,
        this.formatString(message, ...args)
      );
  }

  public error(message: string, ...args: any[]) {
    this.level <= LogLevel.ERROR &&
      console.log(
        chalk.bgRed("ERR!"),
        `${chalk.red(this.prefix)}`,
        `${chalk.gray(this.getTimeString())}`,
        this.formatString(message, ...args)
      );
  }

  public success(message: string, ...args: any[]) {
    this.level <= LogLevel.INFO &&
    console.log(
      chalk.bgGreen("SUCC"),
      `${chalk.green(this.prefix)}`,
      `${chalk.gray(this.getTimeString())}`,
      this.formatString(message, ...args)
    );
  }

  public tips(message: string, ...args: any[]) {
    this.level <= LogLevel.INFO &&
    console.log(
      chalk.bgMagenta("TIPS"),
      chalk.magenta(this.prefix),
      chalk.gray(this.getTimeString()),
      this.formatString(message, ...args)
    );
  }

  public message(sender: string, message: string) {
    console.log(
      chalk.bgWhite("MESG"),
      chalk.gray(`<${sender}>`),
      chalk.gray(this.getTimeString()),
      message
    );
  }

  public essentialInfo(message: string, ...args: any[]) {
    console.log(
      chalk.bgCyan("INFO"),
      `${chalk.gray(this.prefix)}`,
      `${chalk.gray(this.getTimeString())}`,
      this.formatString(message, ...args)
    );
  }
}