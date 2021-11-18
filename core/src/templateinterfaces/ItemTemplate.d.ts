import {UnitAttributeAdjustments} from "../unit/UnitAttributes";

import {CombatAbilityTemplate} from "./CombatAbilityTemplate";
import {ManufacturableThing} from "./ManufacturableThing";
import {PassiveSkillTemplate} from "./PassiveSkillTemplate";
import { Resources } from "../player/PlayerResources";
import { ItemModifier } from "../maplevelmodifiers/ItemModifier";
import { AvailabilityData } from "./AvailabilityData";


export interface ItemTemplate extends ManufacturableThing
{
  key: string;
  displayName: string;
  description: string;
  getIcon: () => HTMLElement;

  // TODO 2019.11.09 | remove
  techLevel: number;

  slot: string;
  isLockedToUnit?: boolean;

  buildCost: Resources;

  ability?: CombatAbilityTemplate;
  attributeAdjustments?: UnitAttributeAdjustments;
  availabilityData: AvailabilityData;
  mapLevelModifiers?: ItemModifier[];
}
