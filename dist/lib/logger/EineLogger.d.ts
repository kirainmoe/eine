import { LogLevel } from "../../common/types";
/**
 * Eine Logger - 日志组件
 */
export default class EineLogger {
    private level;
    private prefix;
    constructor(level: LogLevel, prefix: string);
    /**
     * 获取当前时间格式化字符串
     * @returns string
     */
    getTimeString(): string;
    /**
     * 格式化字符串
     * @param pattern 字符串模板
     * @param args 值
     * @returns 返回格式化后的字符
     */
    formatString(pattern: string, ...args: any[]): string;
    verbose(message: string, ...args: any[]): void;
    info(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    error(message: string, ...args: any[]): void;
    success(message: string, ...args: any[]): void;
    tips(message: string, ...args: any[]): void;
    message(sender: string, message: string): void;
}
