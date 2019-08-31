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

export function mergeAbilityTargetDisplayDataById(...toMerge: AbilityTargetDisplayDataById[]): AbilityTargetDisplayDataById
{
  const merged: AbilityTargetDisplayDataById = {};

  toMerge.forEach(data =>
  {
    for (const unitId in data)
    {
      if (!merged[unitId])
      {
        merged[unitId] =
        {
          targetEffect: data[unitId].targetEffect,
          targetType: data[unitId].targetType,
        };
      }
      else
      {
        // tslint:disable:no-bitwise
        merged[unitId].targetEffect = merged[unitId].targetEffect | data[unitId].targetEffect;
        merged[unitId].targetType = merged[unitId].targetType | data[unitId].targetType;
        // tslint:enable:no-bitwise
      }
    }
  });

  return merged;
}
