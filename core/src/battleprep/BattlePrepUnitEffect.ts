import { FlatAndMultiplierAdjustment } from "../generic/FlatAndMultiplierAdjustment";
import { Unit } from "../unit/Unit";
import { BattlePrepFormation } from "./BattlePrepFormation";
import { BattlePrep } from "./BattlePrep";


export type BaseBattlePrepUnitEffect = (
  strength: number,
  unit: Unit,
  battlePrep: BattlePrep,
  ownFormation: BattlePrepFormation,
  enemyFormation: BattlePrepFormation,
) => void;

export type BattlePrepUnitEffect =
{
  initialize?: BaseBattlePrepUnitEffect;
  whenPartOfFormation?:
  {
    onAdd: BaseBattlePrepUnitEffect;
    onRemove: BaseBattlePrepUnitEffect;
  };
};

export type BattlePrepUnitEffectWithAdjustment =
{
  effect: BattlePrepUnitEffect;
  adjustment: Partial<FlatAndMultiplierAdjustment>;
};
