import { FlatAndMultiplierAdjustment, getBaseAdjustment } from "../generic/FlatAndMultiplierAdjustment";
import { Player } from "../player/Player";
import { Star } from "../map/Star";
import { Unit } from "../unit/Unit";
import { PartialMapLevelModifier } from "./MapLevelModifiers";
import { PlayerModifierAdjustments } from "./PlayerModifier";
import { StarModifierAdjustments } from "./StarModifier";
import { UnitModifierAdjustments } from "./UnitModifier";


type CustomPlayerAdjustment =
{
  onChange: (target: Player, changes: PartialMapLevelModifier<PlayerModifierAdjustments>) => void;
};
type CustomStarAdjustment =
{
  onChange: (target: Star, changes: PartialMapLevelModifier<StarModifierAdjustments>) => void;
};
type CustomUnitAdjustment =
{
  onChange: (target: Unit, changes: PartialMapLevelModifier<UnitModifierAdjustments>) => void;
};
export type CustomAdjustmentsByType =
{
  player: {[key: string]: CustomPlayerAdjustment};
  star: {[key: string]: CustomStarAdjustment};
  unit: {[key: string]: CustomUnitAdjustment};
};

export class CustomModifierAdjustments
{
  private readonly customAdjustments: CustomAdjustmentsByType =
  {
    player: {},
    star: {},
    unit: {},
  };

  public has(
    type: keyof CustomModifierAdjustments["customAdjustments"],
    adjustmentKey: string,
  ): boolean
  {
    return Boolean(this.customAdjustments[type][adjustmentKey]);
  }
  public add(
    adjustments: Partial<CustomAdjustmentsByType>,
  ): void
  {
    for (const type in adjustments)
    {
      for (const key in adjustments[type])
      {
        const adjustment = adjustments[type][key];

        if (this.has(<keyof CustomAdjustmentsByType>type, key))
        {
          // TODO 2019.11.03 | warn
        }

        this.customAdjustments[type][key] = adjustment;
      }
    }
  }
  public getBaseAdjustmentsFor(
    type: keyof CustomModifierAdjustments["customAdjustments"],
  ): {[key: string]: FlatAndMultiplierAdjustment}
  {
    const baseAdjustments: {[key: string]: FlatAndMultiplierAdjustment} = {};

    for (const key in this.customAdjustments[type])
    {
      baseAdjustments[key] = getBaseAdjustment();
    }

    return baseAdjustments;
  }
}
