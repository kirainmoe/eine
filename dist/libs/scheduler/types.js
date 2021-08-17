"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.When = exports.FromEvery = exports.Every = exports.Range = exports.ScheduleRuleItemType = void 0;
var ScheduleRuleItemType;
(function (ScheduleRuleItemType) {
    ScheduleRuleItemType[ScheduleRuleItemType["EVERY"] = 0] = "EVERY";
    ScheduleRuleItemType[ScheduleRuleItemType["FROM_EVERY"] = 1] = "FROM_EVERY";
    ScheduleRuleItemType[ScheduleRuleItemType["WHEN"] = 2] = "WHEN";
})(ScheduleRuleItemType = exports.ScheduleRuleItemType || (exports.ScheduleRuleItemType = {}));
const Range = (from, to) => ({
    from,
    to,
});
exports.Range = Range;
const Every = (step) => ({
    type: ScheduleRuleItemType.EVERY,
    step,
});
exports.Every = Every;
const FromEvery = (from, step) => ({
    type: ScheduleRuleItemType.FROM_EVERY,
    from,
    step,
});
exports.FromEvery = FromEvery;
const When = (at) => ({
    type: ScheduleRuleItemType.WHEN,
    at,
});
exports.When = When;
//# sourceMappingURL=types.js.map