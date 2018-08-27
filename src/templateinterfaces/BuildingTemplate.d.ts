import {BuildingEffect} from "../BuildingEffect";
import UnitEffectTemplate from "./UnitEffectTemplate";
import {default as Star} from "../Star";
import Player from "../Player";

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
  maxBuiltForPlayer?: number;
  maxBuiltGlobally?: number;
  canBeBuiltInLocation?: (star: Star) => boolean;

  onBuild?: (location: Star, player: Player) => void;
  getEffect?: () => BuildingEffect;

  // player race can define their own special upgrades as well
  getStandardUpgradeTargets?: (location: Star) => BuildingTemplate[];

  battleEffects?: UnitEffectTemplate[];
}
