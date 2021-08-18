import cron from "node-cron";
import Eine from "../..";
import EineLogger from "../logger";

import { Every, FromEvery, RangeType, ScheduleRuleItem, ScheduleRuleItemType, When, } from "../../common/types/SchedulerType";

/** EineScheduer: 计划任务调度器 */
export default class EineScheduler {
  /** 日志记录器 */
  private logger: EineLogger;

  /** 用户设置的 cron 规则 */
  private currentRule: ScheduleRuleItem[][] = this.createEmptyRule();

  /** 根据用户设置推断的 cron 规则 */
  private inferredRule: ScheduleRuleItem[][] = this.createEmptyRule();

  /** 当前规则缓存值 */
  private currentValue: ScheduleRuleItem[] = [];

  /** 覆盖规则，规则优先级：override > current > inferred */
  private overrideRule: string = "";

  public constructor(eine: Eine) {
    this.logger = eine.logger;
  }

  /** 创建新的计划任务，恢复初始状态 */
  public create() {
    this.currentRule = this.createEmptyRule();
    this.currentValue = [];
    this.inferredRule = this.createEmptyRule();
    this.overrideRule = "";
    return this;
  }

  /** 创建空规则数组 */
  private createEmptyRule() {
    return Array(6).fill([]);
  }

  /** 每 step 时段运行一次，step 未指定或为 -1 时，则为每个单位运行一次 */
  public every(step: number | RangeType = -1) {
    this.currentValue.push(Every(step));
    return this;
  }

  /** 从 from 开始，每 step 时段运行一次 */
  public fromEvery(from: number | RangeType, step: number | RangeType = -1) {
    this.currentValue.push(FromEvery(from, step));
    return this; 
  }

  /** 在 at 时执行 */
  public when(at: number | RangeType) {
    this.currentValue.push(When(at));
    return this;
  }

  public fillEvery(from: number, to: number) {
    for (let i = from; i <= to; i++)
      if (!this.currentRule[i].length)
        this.inferredRule[i] = [Every(-1)];
  }

  public fillZero(from: number, to: number) {
    for (let i = from; i <= to; i++)
      if (!this.currentRule[i].length)
        this.inferredRule[i] = [When(0)];
  }

  public second() {
    this.currentRule[0] = this.currentRule[0].concat(this.currentValue);
    this.currentValue = [];
    this.fillEvery(1, 5);
    return this;
  }

  public minute() {
    this.currentRule[1] = this.currentRule[1].concat(this.currentValue);
    this.currentValue = [];
    this.fillZero(0, 0);
    this.fillEvery(2, 5);
    return this;
  }

  public hour() {
    this.currentRule[2] = this.currentRule[2].concat(this.currentValue);
    this.currentValue = [];
    this.fillZero(0, 1);
    this.fillEvery(3, 5);
    return this;
  }

  public day() {
    this.currentRule[3] = this.currentRule[3].concat(this.currentValue);
    this.currentValue = [];
    this.fillZero(0, 2);
    this.fillEvery(4, 5);
    return this;
  }

  public month() {
    this.currentRule[4] = this.currentRule[4].concat(this.currentValue);
    this.currentValue = [];
    this.fillZero(0, 3);
    this.fillEvery(5, 5);
    return this;
  }

  public dayOfWeek() {
    this.currentRule[5] = this.currentRule[5].concat(this.currentValue);
    this.currentValue = [];
    this.fillZero(0, 4);
    return this;
  }

  public cronRule(rule: string) {
    this.overrideRule = rule;
    return this;
  }

  private joinAsRule() {
    if (this.overrideRule.length)
      return this.overrideRule;

    const finalRules = [];
    for (let i = 0; i <= 5; i++) {
      finalRules.push(this.currentRule[i].length ? this.currentRule[i] : this.inferredRule[i]);
    }
    
    return finalRules
      .map((ruleArray) =>
        ruleArray
          .map((rule) => {
            if (typeof rule === "number")
              return String(rule === -1 ? "*" : rule);
            if (rule.type === ScheduleRuleItemType.EVERY)
              return rule.step === -1 ? "*" : `*/${rule.step}`;
            if (rule.type === ScheduleRuleItemType.WHEN)
              return String(rule.at);
            return `${rule.from}/${rule.step}`;
          })
          .join(",")
      )
      .join(" ");
  }

  public do(job: (...args: any[]) => any) {
    const rule = this.joinAsRule();

    if (!cron.validate(rule)) {
      this.logger.error("Failed to create cron job, crontab rule {} is invalid.", rule);
      return false;
    }

    cron.schedule(rule, job);
    this.logger.verbose("Created crontab job, rule: {}, task: {}", rule, job.name);
    return true;
  }
}