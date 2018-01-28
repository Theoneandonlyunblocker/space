// tslint:disable:no-bitwise
export enum AbilityTargetType
{
  Primary   = 1 << 0,
  Secondary = 1 << 1,
  Random    = 1 << 2,
}

export enum AbilityTargetEffect
{
  Positive  = 1 << 0,
  Negative  = 1 << 1,
  Random    = 1 << 2,
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
    for (let unitId in data)
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
        merged[unitId].targetEffect = merged[unitId].targetEffect | data[unitId].targetEffect;
        merged[unitId].targetType = merged[unitId].targetType | data[unitId].targetType;
      }
    }
  });

  return merged;
}
