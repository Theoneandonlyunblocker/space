import {BattleScripts} from "./BattleScripts";
import {DiplomacyScripts} from "./DiplomacyScripts";
import {GameScripts} from "./GameScripts";
import {UnitScripts} from "./UnitScripts";

export interface AllScripts
{
  battle: BattleScripts;
  diplomacy: DiplomacyScripts;
  game: GameScripts;
  unit: UnitScripts;
}
