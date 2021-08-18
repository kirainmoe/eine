"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.When = exports.FromEvery = exports.Every = exports.Range = exports.ScheduleRuleItemType = void 0;
var ScheduleRuleItemType;
(function (ScheduleRuleItemType) {
    ScheduleRuleItemType[ScheduleRuleItemType["EVERY"] = 0] = "EVERY";
    ScheduleRuleItemType[ScheduleRuleItemType["FROM_EVERY"] = 1] = "FROM_EVERY";
    ScheduleRuleItemType[ScheduleRuleItemType["WHEN"] = 2] = "WHEN";
})(ScheduleRuleItemType = exports.ScheduleRuleItemType || (exports.ScheduleRuleItemType = {}));
var Range = function (from, to) { return ({
    from: from,
    to: to,
}); };
exports.Range = Range;
var Every = function (step) { return ({
    type: ScheduleRuleItemType.EVERY,
    step: step,
}); };
exports.Every = Every;
var FromEvery = function (from, step) { return ({
    type: ScheduleRuleItemType.FROM_EVERY,
    from: from,
    step: step,
}); };
exports.FromEvery = FromEvery;
var When = function (at) { return ({
    type: ScheduleRuleItemType.WHEN,
    at: at,
}); };
exports.When = When;
//# sourceMappingURL=SchedulerType.js.map