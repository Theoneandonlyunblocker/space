import AbilityBase from "./AbilityBase";
import UnitPassiveEffect from "./UnitPassiveEffect";
import AbilityEffectTemplate from "./AbilityEffectTemplate";
import BattlePrepEffect from "./BattlePrepEffect";
import TurnStartEffect from "./TurnStartEffect";

declare interface PassiveSkillTemplate extends AbilityBase, UnitPassiveEffect
{
  type: string;
  displayName: string;
  description: string;
  isHidden?: boolean;
  
  atBattleStart?: AbilityEffectTemplate[];
  atTurnStart?: TurnStartEffect[];
  inBattlePrep?: BattlePrepEffect[];
}

export default PassiveSkillTemplate;
