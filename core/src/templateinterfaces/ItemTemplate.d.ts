import {UnitAttributeAdjustments} from "../unit/UnitAttributes";

import {AbilityTemplate} from "./AbilityTemplate";
import {ManufacturableThing} from "./ManufacturableThing";
import {PassiveSkillTemplate} from "./PassiveSkillTemplate";
import { Resources } from "../player/PlayerResources";


export interface ItemTemplate extends ManufacturableThing
{
  type: string;
  displayName: string;
  description: string;
  getIcon: () => HTMLElement;

  techLevel: number;

  slot: string;

  buildCost: Resources;
  kind: "item";

  ability?: AbilityTemplate;
  passiveSkill?: PassiveSkillTemplate;
  attributeAdjustments?: UnitAttributeAdjustments;
}
