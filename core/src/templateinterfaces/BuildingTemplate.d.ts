import {Star} from "../map/Star";
import {Player} from "../player/Player";
import { UnlockableThing } from "./UnlockableThing";
import { BuildingFamily } from "./BuildingFamily";
import { Resources } from "../player/PlayerResources";
import { FlatAndMultiplierAdjustment } from "../generic/FlatAndMultiplierAdjustment";
import { BuildingModifier } from "../maplevelmodifiers/BuildingModifier";
import { AvailabilityData } from "./AvailabilityData";


export interface BuildingTemplate extends UnlockableThing
{
  key: string;
  displayName: string;
  description: string;

  buildCost: Resources;

  families: BuildingFamily[];
  maxBuiltAtLocation?: number;
  maxBuiltForPlayer?: number;
  maxBuiltGlobally?: number;
  canBeBuiltInLocation?: (star: Star) => boolean;

  onBuild?: (location: Star, player: Player) => void;
  mapLevelModifiers?: BuildingModifier[];

  // player race can define their own special upgrades as well
  getStandardUpgradeTargets?: (location: Star) => BuildingTemplate[];

  availabilityData: AvailabilityData;
}
