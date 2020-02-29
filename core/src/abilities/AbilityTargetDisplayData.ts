// can't use binary operators in assignment as it clobbers the enum type
// https://github.com/Microsoft/TypeScript/issues/22709
export enum AbilityTargetType
{
  Primary   = 1,
  Secondary = 2,
  Random    = 4,
}

export enum AbilityTargetEffect
{
  Positive  = 1,
  Negative  = 2,
  Random    = 4,
}

export interface AbilityTargetDisplayData
{
  targetEffect: AbilityTargetEffect;
  targetType: AbilityTargetType;
}

export type AbilityTargetDisplayDataById =
{
  [id: number]: AbilityTargetDisplayData;
};
