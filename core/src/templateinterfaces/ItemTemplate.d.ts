import {UnitAttributeAdjustments} from "../unit/UnitAttributes";

import {AbilityTemplate} from "./AbilityTemplate";
import {ManufacturableThing} from "./ManufacturableThing";
import {PassiveSkillTemplate} from "./PassiveSkillTemplate";
import { Resources } from "../player/PlayerResources";
import { ItemModifier } from "../maplevelmodifiers/ItemModifier";
import { AvailabilityData } from "./AvailabilityData";


export interface ItemTemplate extends ManufacturableThing
{
  type: string;
  displayName: string;
  description: string;
  getIcon: () => HTMLElement;

  // TODO 2019.11.09 | remove
  techLevel: number;

  slot: string;

  buildCost: Resources;
  kind: "item";

  ability?: AbilityTemplate;
  passiveSkill?: PassiveSkillTemplate;
  attributeAdjustments?: UnitAttributeAdjustments;
  availabilityData: AvailabilityData;
  mapLevelModifiers?: ItemModifier[];
}
