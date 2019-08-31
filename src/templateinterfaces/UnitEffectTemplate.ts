import {UnitAttributeAdjustments} from "../unit/UnitAttributes";

import {AbilityEffectTemplate} from "./AbilityEffectTemplate";
import {BattlePrepEffect} from "./BattlePrepEffect";
import {TurnStartEffect} from "./TurnStartEffect";


export interface UnitEffectTemplate
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
