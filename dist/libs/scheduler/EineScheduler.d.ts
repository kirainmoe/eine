import Eine from "../..";
import { RangeType } from "../../common/types/SchedulerType";
/** EineScheduer: 计划任务调度器 */
export default class EineScheduler {
    /** 日志记录器 */
    private logger;
    /** 用户设置的 cron 规则 */
    private currentRule;
    /** 根据用户设置推断的 cron 规则 */
    private inferredRule;
    /** 当前规则缓存值 */
    private currentValue;
    /** 覆盖规则，规则优先级：override > current > inferred */
    private overrideRule;
    constructor(eine: Eine);
    /** 创建新的计划任务，恢复初始状态 */
    create(): this;
    /** 创建空规则数组 */
    private createEmptyRule;
    /** 每 step 时段运行一次，step 未指定或为 -1 时，则为每个单位运行一次 */
    every(step?: number | RangeType): this;
    /** 从 from 开始，每 step 时段运行一次 */
    fromEvery(from: number | RangeType, step?: number | RangeType): this;
    /** 在 at 时执行 */
    when(at: number | RangeType): this;
    fillEvery(from: number, to: number): void;
    fillZero(from: number, to: number): void;
    second(): this;
    minute(): this;
    hour(): this;
    day(): this;
    month(): this;
    dayOfWeek(): this;
    cronRule(rule: string): this;
    private joinAsRule;
    do(job: (...args: any[]) => any): boolean;
}
