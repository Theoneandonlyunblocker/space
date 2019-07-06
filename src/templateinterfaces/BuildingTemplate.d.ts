import {BuildingEffect} from "../BuildingEffect";
import {UnitEffectTemplate} from "./UnitEffectTemplate";
import {Star} from "../Star";
import {Player} from "../Player";
import { UnlockableThing } from "./UnlockableThing";
import { BuildingFamily } from "./BuildingFamily";

export interface BuildingTemplate extends UnlockableThing
{
  type: string;
  displayName: string;
  description: string;

  buildCost: number;
  kind: "building";

  families: BuildingFamily[];
  maxBuiltAtLocation?: number;
  maxBuiltForPlayer?: number;
  maxBuiltGlobally?: number;
  canBeBuiltInLocation?: (star: Star) => boolean;

  onBuild?: (location: Star, player: Player) => void;
  getEffect?: () => BuildingEffect;

  // player race can define their own special upgrades as well
  getStandardUpgradeTargets?: (location: Star) => BuildingTemplate[];

  battleEffects?: UnitEffectTemplate[];
}
