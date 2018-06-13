import {BuildingEffect} from "../BuildingEffect";
import UnitEffectTemplate from "./UnitEffectTemplate";

export declare interface BuildingTemplate
{
  type: string;
  displayName: string;
  description: string;

  buildCost: number;

  family?: string; // all buildings in same family count towards maxPerType
  maxPerType: number;

  getEffect?: (upgradeLevel: number) => BuildingEffect;

  maxUpgradeLevel: number;
  // TODO 2018.06.05 | rename into canBeBuilt or something
  // why not use same system for buildability as units?
  upgradeOnly?: boolean;
  upgradeInto?:
  {
    templateType: string;
    level: number;
  }[];

  battleEffects?: UnitEffectTemplate[];
}
