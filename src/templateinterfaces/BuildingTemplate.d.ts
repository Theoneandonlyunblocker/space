import {BuildingEffect} from "../BuildingEffect";
import UnitEffectTemplate from "./UnitEffectTemplate";

declare interface BuildingTemplate
{
  type: string;
  category: string;
  displayName: string;
  description: string;

  iconSrc: string;
  buildCost: number;

  family?: string; // all buildings in same family count towards maxPerType
  maxPerType: number;

  getEffect?: (upgradeLevel: number) => Partial<BuildingEffect>;

  maxUpgradeLevel: number;
  // TODO 2018.06.05 | split into canBeBuilt & canBeUpgraded or something
  // why not use same system for buildability as units?
  upgradeOnly?: boolean;
  upgradeInto?:
  {
    templateType: string;
    level: number;
  }[];

  battleEffects?: UnitEffectTemplate[];
}

export default BuildingTemplate;
