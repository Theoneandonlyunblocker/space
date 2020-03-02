import { BattlePrepFormation } from "./BattlePrepFormation";
import { BattlePrep } from "./BattlePrep";
import { Building } from "../building/Building";
import { FlatAndMultiplierAdjustment } from "../generic/FlatAndMultiplierAdjustment";


export interface BuildingBattlePrepEffect
{
  onBattlePrepStart: (
    strength: number,
    building: Building,
    battlePrep: BattlePrep,
    ownFormation: BattlePrepFormation,
    enemyFormation: BattlePrepFormation,
  ) => void;
}

export type BuildingBattlePrepEffectWithAdjustment =
{
  effect: BuildingBattlePrepEffect;
  adjustment: Partial<FlatAndMultiplierAdjustment>;
};
