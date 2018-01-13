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
      // undefined | x === 0 | x
      // use 0 anyway for clarity
      merged[unitId].targetEffect = (merged[unitId].targetEffect || 0) | data[unitId].targetEffect;
      merged[unitId].targetType =   (merged[unitId].targetType   || 0) | data[unitId].targetType;
    }
  });

  return merged;
}
