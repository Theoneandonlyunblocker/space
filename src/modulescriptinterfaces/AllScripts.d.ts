import {BattleScripts} from "./BattleScripts";
import {GameScripts} from "./GameScripts";
import {UnitScripts} from "./UnitScripts";

export interface AllScripts
{
  battle: BattleScripts;
  unit: UnitScripts;
  game: GameScripts;
}
