import BattlePrep from "../BattlePrep.ts";
import Unit from "../Unit.ts";

declare interface BattlePrepEffect
{
  (unit: Unit, battlePrep: BattlePrep): void;
}

export default BattlePrepEffect;
