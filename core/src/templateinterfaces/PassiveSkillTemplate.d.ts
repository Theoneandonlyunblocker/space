import {AbilityBase} from "./AbilityBase";
import { UnitModifier } from "../maplevelmodifiers/UnitModifier";


export interface PassiveSkillTemplate extends AbilityBase
{
  mapLevelModifiers: UnitModifier[];

  use?: never;
}
