import BattlePrep from "../BattlePrep";
import {BattlePrepFormation} from "../BattlePrepFormation";
import Unit from "../Unit";


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
