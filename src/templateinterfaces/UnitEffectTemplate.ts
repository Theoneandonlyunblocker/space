import {UnitAttributeAdjustments} from "../UnitAttributes";

import {AbilityEffectTemplate} from "./AbilityEffectTemplate";
import {BattlePrepEffect} from "./BattlePrepEffect";
import TurnStartEffect from "./TurnStartEffect";


declare interface UnitEffectTemplate
{
  type: string;
  displayName?: string;
  description?: string;
  isHidden?: boolean;

  attributes?: UnitAttributeAdjustments;

  inBattlePrep?: BattlePrepEffect[];
  atBattleStart?: AbilityEffectTemplate[];
  beforeAbilityUse?: AbilityEffectTemplate[];
  atTurnStart?: TurnStartEffect[];
  afterAbilityUse?: AbilityEffectTemplate[];
}

export default UnitEffectTemplate;
