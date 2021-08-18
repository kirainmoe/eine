export declare enum ScheduleRuleItemType {
    EVERY = 0,
    FROM_EVERY = 1,
    WHEN = 2
}
export interface RangeType {
    from: number;
    to: number;
}
export interface EveryType {
    type: ScheduleRuleItemType.EVERY;
    step: number | RangeType;
}
export interface FromEveryType {
    type: ScheduleRuleItemType.FROM_EVERY;
    from: number | RangeType;
    step: number | RangeType;
}
export interface WhenType {
    type: ScheduleRuleItemType.WHEN;
    at: number | RangeType;
}
export declare type ScheduleRuleItem = EveryType | FromEveryType | WhenType;
export declare const Range: (from: number, to: number) => RangeType;
export declare const Every: (step: number | RangeType) => EveryType;
export declare const FromEvery: (from: number | RangeType, step: number | RangeType) => FromEveryType;
export declare const When: (at: number | RangeType) => WhenType;
