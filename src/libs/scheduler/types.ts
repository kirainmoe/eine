export enum ScheduleRuleItemType {
  EVERY,
  FROM_EVERY,
  WHEN,
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

export type ScheduleRuleItem = EveryType | FromEveryType | WhenType;

export const Range = (from: number, to: number) => ({
  from,
  to,
} as RangeType);

export const Every = (step: number | RangeType) => ({
  type: ScheduleRuleItemType.EVERY,
  step,
} as EveryType);

export const FromEvery = (from: number | RangeType, step: number | RangeType) => ({
  type: ScheduleRuleItemType.FROM_EVERY,
  from,
  step,
} as FromEveryType);

export const When = (at: number | RangeType) => ({
  type: ScheduleRuleItemType.WHEN,
  at,
} as WhenType);