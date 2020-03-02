import { BuildingBattlePrepEffectWithAdjustment } from "core/src/battleprep/BuildingBattlePrepEffect";


export function makeDefenderAdvantageEffect(amount: number): BuildingBattlePrepEffectWithAdjustment
{
  return {
    adjustment: {flat: amount},
    effect:
    {
      onBattlePrepStart: (strength, building, battlePrep) =>
      {
        // TODO 2020.03.02 | implement
      },
    },
  };
}
