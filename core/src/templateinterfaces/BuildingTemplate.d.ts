import {PartialBuildingEffect} from "../building/BuildingEffect";
import {UnitEffectTemplate} from "./UnitEffectTemplate";
import {Star} from "../map/Star";
import {Player} from "../player/Player";
import { UnlockableThing } from "./UnlockableThing";
import { BuildingFamily } from "./BuildingFamily";
import { Resources } from "../player/PlayerResources";
import { FlatAndMultiplierAdjustment } from "../generic/FlatAndMultiplierAdjustment";

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
  buildingEffect?: PartialBuildingEffect;
  income?:
  {
    [resourceType: string]: Partial<FlatAndMultiplierAdjustment>;
  };

  // player race can define their own special upgrades as well
  getStandardUpgradeTargets?: (location: Star) => BuildingTemplate[];

  battleEffects?: UnitEffectTemplate[];
}
