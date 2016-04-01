import AbilityBase from "./AbilityBase.d.ts";
import BattlePrepEffect from "./BattlePrepEffect.d.ts";
import TurnStartEffect from "./TurnStartEffect.d.ts";

declare interface PassiveSkillTemplate extends AbilityBase
{
  type: string;
  displayName: string;
  description: string;
  isHidden?: boolean;
  
  atBattleStart?: AbilityEffectTemplate[];
  beforeAbilityUse?: AbilityEffectTemplate[];
  afterAbilityUse?: AbilityEffectTemplate[];
  atTurnStart?: TurnStartEffect[];
  inBattlePrep?: BattlePrepEffect[];
}

export default PassiveSkillTemplate;
