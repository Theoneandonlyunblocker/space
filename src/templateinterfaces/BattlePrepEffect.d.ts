import BattlePrep from "../BattlePrep";
import Unit from "../Unit";

declare interface BattlePrepEffect
{
  (unit: Unit, battlePrep: BattlePrep): void;
}

export default BattlePrepEffect;
