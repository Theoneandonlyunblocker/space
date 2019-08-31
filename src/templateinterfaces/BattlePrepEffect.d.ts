import {BattlePrep} from "../battleprep/BattlePrep";
import {BattlePrepFormation} from "../battleprep/BattlePrepFormation";
import {Unit} from "../unit/Unit";


export type BaseBattlePrepEffect = (
  unit: Unit,
  battlePrep: BattlePrep,
  ownFormation?: BattlePrepFormation,
  enemyFormation?: BattlePrepFormation,
) => void;

export type BattlePrepEffect =
{
  onAdd: BaseBattlePrepEffect;
  onRemove: BaseBattlePrepEffect;
};
