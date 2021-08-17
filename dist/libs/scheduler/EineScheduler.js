"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const types_1 = require("./types");
/** EineScheduer: 计划任务调度器 */
class EineScheduler {
    /** 日志记录器 */
    logger;
    /** 用户设置的 cron 规则 */
    currentRule = this.createEmptyRule();
    /** 根据用户设置推断的 cron 规则 */
    inferredRule = this.createEmptyRule();
    /** 当前规则缓存值 */
    currentValue = [];
    /** 覆盖规则，规则优先级：override > current > inferred */
    overrideRule = "";
    constructor(eine) {
        this.logger = eine.logger;
    }
    /** 创建新的计划任务，恢复初始状态 */
    create() {
        this.currentRule = this.createEmptyRule();
        this.currentValue = [];
        this.inferredRule = this.createEmptyRule();
        this.overrideRule = "";
        return this;
    }
    /** 创建空规则数组 */
    createEmptyRule() {
        return Array(6).fill([]);
    }
    /** 每 step 时段运行一次，step 未指定或为 -1 时，则为每个单位运行一次 */
    every(step = -1) {
        this.currentValue.push(types_1.Every(step));
        return this;
    }
    /** 从 from 开始，每 step 时段运行一次 */
    fromEvery(from, step = -1) {
        this.currentValue.push(types_1.FromEvery(from, step));
        return this;
    }
    /** 在 at 时执行 */
    when(at) {
        this.currentValue.push(types_1.When(at));
        return this;
    }
    fillEvery(from, to) {
        for (let i = from; i <= to; i++)
            if (!this.currentRule[i].length)
                this.inferredRule[i] = [types_1.Every(-1)];
    }
    fillZero(from, to) {
        for (let i = from; i <= to; i++)
            if (!this.currentRule[i].length)
                this.inferredRule[i] = [types_1.When(0)];
    }
    second() {
        this.currentRule[0] = this.currentRule[0].concat(this.currentValue);
        this.currentValue = [];
        this.fillEvery(1, 5);
        return this;
    }
    minute() {
        this.currentRule[1] = this.currentRule[1].concat(this.currentValue);
        this.currentValue = [];
        this.fillZero(0, 0);
        this.fillEvery(2, 5);
        return this;
    }
    hour() {
        this.currentRule[2] = this.currentRule[2].concat(this.currentValue);
        this.currentValue = [];
        this.fillZero(0, 1);
        this.fillEvery(3, 5);
        return this;
    }
    day() {
        this.currentRule[3] = this.currentRule[3].concat(this.currentValue);
        this.currentValue = [];
        this.fillZero(0, 2);
        this.fillEvery(4, 5);
        return this;
    }
    month() {
        this.currentRule[4] = this.currentRule[4].concat(this.currentValue);
        this.currentValue = [];
        this.fillZero(0, 3);
        this.fillEvery(5, 5);
        return this;
    }
    dayOfWeek() {
        this.currentRule[5] = this.currentRule[5].concat(this.currentValue);
        this.currentValue = [];
        this.fillZero(0, 4);
        return this;
    }
    cronRule(rule) {
        this.overrideRule = rule;
        return this;
    }
    joinAsRule() {
        if (this.overrideRule.length)
            return this.overrideRule;
        const finalRules = [];
        for (let i = 0; i <= 5; i++) {
            finalRules.push(this.currentRule[i].length ? this.currentRule[i] : this.inferredRule[i]);
        }
        return finalRules
            .map((ruleArray) => ruleArray
            .map((rule) => {
            if (typeof rule === "number")
                return String(rule === -1 ? "*" : rule);
            if (rule.type === types_1.ScheduleRuleItemType.EVERY)
                return rule.step === -1 ? "*" : `*/${rule.step}`;
            if (rule.type === types_1.ScheduleRuleItemType.WHEN)
                return String(rule.at);
            return `${rule.from}/${rule.step}`;
        })
            .join(","))
            .join(" ");
    }
    do(job) {
        const rule = this.joinAsRule();
        if (!node_cron_1.default.validate(rule)) {
            this.logger.error("Failed to create cron job, crontab rule {} is invalid.", rule);
            return false;
        }
        node_cron_1.default.schedule(rule, job);
        this.logger.verbose("Created crontab job, rule: {}, task: {}", rule, job.name);
        return true;
    }
}
exports.default = EineScheduler;
//# sourceMappingURL=EineScheduler.js.map