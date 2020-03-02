import { Unit } from "../unit/Unit";
import { BattlePrepFormation } from "./BattlePrepFormation";
import { BattlePrep } from "./BattlePrep";
import { FlatAndMultiplierAdjustment } from "../generic/FlatAndMultiplierAdjustment";


export type BaseUnitBattlePrepEffect = (
  strength: number,
  unit: Unit,
  battlePrep: BattlePrep,
  ownFormation: BattlePrepFormation,
  enemyFormation: BattlePrepFormation,
) => void;

export type UnitBattlePrepEffect =
{
  onBattlePrepStart?: BaseUnitBattlePrepEffect;
  whenPartOfFormation?:
  {
    onAdd: BaseUnitBattlePrepEffect;
    onRemove: BaseUnitBattlePrepEffect;
  };
};

export type UnitBattlePrepEffectWithAdjustment =
{
  effect: UnitBattlePrepEffect;
  adjustment: Partial<FlatAndMultiplierAdjustment>;
};
