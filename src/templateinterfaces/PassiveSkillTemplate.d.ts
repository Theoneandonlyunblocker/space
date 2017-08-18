import AbilityBase from "./AbilityBase";
import {AbilityEffectTemplate} from "./AbilityEffectTemplate";
import BattlePrepEffect from "./BattlePrepEffect";
import TurnStartEffect from "./TurnStartEffect";
import UnitEffectTemplate from "./UnitEffectTemplate";

declare interface PassiveSkillTemplate extends AbilityBase, UnitEffectTemplate
{
  displayName: string;
  description: string;
}

export default PassiveSkillTemplate;
