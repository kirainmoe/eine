"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_cron_1 = __importDefault(require("node-cron"));
var SchedulerType_1 = require("../../common/types/SchedulerType");
/** EineScheduer: 计划任务调度器 */
var EineScheduler = /** @class */ (function () {
    function EineScheduler(eine) {
        /** 用户设置的 cron 规则 */
        this.currentRule = this.createEmptyRule();
        /** 根据用户设置推断的 cron 规则 */
        this.inferredRule = this.createEmptyRule();
        /** 当前规则缓存值 */
        this.currentValue = [];
        /** 覆盖规则，规则优先级：override > current > inferred */
        this.overrideRule = "";
        this.logger = eine.logger;
    }
    /** 创建新的计划任务，恢复初始状态 */
    EineScheduler.prototype.create = function () {
        this.currentRule = this.createEmptyRule();
        this.currentValue = [];
        this.inferredRule = this.createEmptyRule();
        this.overrideRule = "";
        return this;
    };
    /** 创建空规则数组 */
    EineScheduler.prototype.createEmptyRule = function () {
        return Array(6).fill([]);
    };
    /** 每 step 时段运行一次，step 未指定或为 -1 时，则为每个单位运行一次 */
    EineScheduler.prototype.every = function (step) {
        if (step === void 0) { step = -1; }
        this.currentValue.push(SchedulerType_1.Every(step));
        return this;
    };
    /** 从 from 开始，每 step 时段运行一次 */
    EineScheduler.prototype.fromEvery = function (from, step) {
        if (step === void 0) { step = -1; }
        this.currentValue.push(SchedulerType_1.FromEvery(from, step));
        return this;
    };
    /** 在 at 时执行 */
    EineScheduler.prototype.when = function (at) {
        this.currentValue.push(SchedulerType_1.When(at));
        return this;
    };
    EineScheduler.prototype.fillEvery = function (from, to) {
        for (var i = from; i <= to; i++)
            if (!this.currentRule[i].length)
                this.inferredRule[i] = [SchedulerType_1.Every(-1)];
    };
    EineScheduler.prototype.fillZero = function (from, to) {
        for (var i = from; i <= to; i++)
            if (!this.currentRule[i].length)
                this.inferredRule[i] = [SchedulerType_1.When(0)];
    };
    EineScheduler.prototype.second = function () {
        this.currentRule[0] = this.currentRule[0].concat(this.currentValue);
        this.currentValue = [];
        this.fillEvery(1, 5);
        return this;
    };
    EineScheduler.prototype.minute = function () {
        this.currentRule[1] = this.currentRule[1].concat(this.currentValue);
        this.currentValue = [];
        this.fillZero(0, 0);
        this.fillEvery(2, 5);
        return this;
    };
    EineScheduler.prototype.hour = function () {
        this.currentRule[2] = this.currentRule[2].concat(this.currentValue);
        this.currentValue = [];
        this.fillZero(0, 1);
        this.fillEvery(3, 5);
        return this;
    };
    EineScheduler.prototype.day = function () {
        this.currentRule[3] = this.currentRule[3].concat(this.currentValue);
        this.currentValue = [];
        this.fillZero(0, 2);
        this.fillEvery(4, 5);
        return this;
    };
    EineScheduler.prototype.month = function () {
        this.currentRule[4] = this.currentRule[4].concat(this.currentValue);
        this.currentValue = [];
        this.fillZero(0, 3);
        this.fillEvery(5, 5);
        return this;
    };
    EineScheduler.prototype.dayOfWeek = function () {
        this.currentRule[5] = this.currentRule[5].concat(this.currentValue);
        this.currentValue = [];
        this.fillZero(0, 4);
        return this;
    };
    EineScheduler.prototype.cronRule = function (rule) {
        this.overrideRule = rule;
        return this;
    };
    EineScheduler.prototype.joinAsRule = function () {
        if (this.overrideRule.length)
            return this.overrideRule;
        var finalRules = [];
        for (var i = 0; i <= 5; i++) {
            finalRules.push(this.currentRule[i].length ? this.currentRule[i] : this.inferredRule[i]);
        }
        return finalRules
            .map(function (ruleArray) {
            return ruleArray
                .map(function (rule) {
                if (typeof rule === "number")
                    return String(rule === -1 ? "*" : rule);
                if (rule.type === SchedulerType_1.ScheduleRuleItemType.EVERY)
                    return rule.step === -1 ? "*" : "*/" + rule.step;
                if (rule.type === SchedulerType_1.ScheduleRuleItemType.WHEN)
                    return String(rule.at);
                return rule.from + "/" + rule.step;
            })
                .join(",");
        })
            .join(" ");
    };
    EineScheduler.prototype.do = function (job) {
        var rule = this.joinAsRule();
        if (!node_cron_1.default.validate(rule)) {
            this.logger.error("Failed to create cron job, crontab rule {} is invalid.", rule);
            return false;
        }
        node_cron_1.default.schedule(rule, job);
        this.logger.verbose("Created crontab job, rule: {}, task: {}", rule, job.name);
        return true;
    };
    return EineScheduler;
}());
exports.default = EineScheduler;
//# sourceMappingURL=EineScheduler.js.map