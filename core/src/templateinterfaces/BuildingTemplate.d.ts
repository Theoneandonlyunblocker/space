import {UnitEffectTemplate} from "./UnitEffectTemplate";
import {Star} from "../map/Star";
import {Player} from "../player/Player";
import { UnlockableThing } from "./UnlockableThing";
import { BuildingFamily } from "./BuildingFamily";
import { Resources } from "../player/PlayerResources";
import { FlatAndMultiplierAdjustment } from "../generic/FlatAndMultiplierAdjustment";
import { BuildingModifiers } from "../maplevelmodifiers/BuildingModifiers";


export interface BuildingTemplate extends UnlockableThing
{
  type: string;
  displayName: string;
  description: string;

  buildCost: Resources;
  kind: "building";

  families: BuildingFamily[];
  maxBuiltAtLocation?: number;
  maxBuiltForPlayer?: number;
  maxBuiltGlobally?: number;
  canBeBuiltInLocation?: (star: Star) => boolean;

  onBuild?: (location: Star, player: Player) => void;
  mapLevelModifiers?: BuildingModifiers;

  // player race can define their own special upgrades as well
  getStandardUpgradeTargets?: (location: Star) => BuildingTemplate[];

  battleEffects?: UnitEffectTemplate[];
}
