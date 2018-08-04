import {BuildingEffect} from "../BuildingEffect";
import UnitEffectTemplate from "./UnitEffectTemplate";
import {default as Star} from "../Star";

export declare interface BuildingTemplate
{
  type: string;
  displayName: string;
  description: string;

  buildCost: number;

  // buildings with same family count towards maxBuilt limit
  // if not specified, type is used instead
  family?: string;
  maxBuiltAtLocation: number;
  // TODO 2018.07.30 | implement
  // maxBuiltForPlayer?: number;
  maxBuiltGlobally?: number;
  canBeBuiltInLocation?: (star: Star) => boolean;

  getEffect?: (upgradeLevel: number) => BuildingEffect;

  maxUpgradeLevel: number;
  upgradeInto?:
  {
    templateType: string;
    level: number;
  }[];

  battleEffects?: UnitEffectTemplate[];
}
