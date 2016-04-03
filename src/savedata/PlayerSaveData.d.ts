import DiplomacyStatusSaveData from "./DiplomacyStatusSaveData.d.ts";
import FlagSaveData from "./FlagSaveData.d.ts";
import FleetSaveData from "./FleetSaveData.d.ts";
import ItemSaveData from "./ItemSaveData.d.ts";
import PlayerTechnologySaveData from "./PlayerTechnologySaveData.d.ts";

declare interface PlayerSaveData
{
  id: number;
  name: string;
  color: number;
  colorAlpha: number;
  secondaryColor: number;
  isIndependent: boolean;
  isAI: boolean;
  resources:
  {
    [resourceType: string]: number;
  };
  diplomacyStatus: DiplomacyStatusSaveData;

  flag?: FlagSaveData;
  personality?: Personality;

  unitIds: number[];
  fleets: FleetSaveData[];
  money: number;
  controlledLocationIds: number[];
  items: ItemSaveData[];
  revealedStarIds: number[];
  identifiedUnitIds: number[];
  researchByTechnology?: PlayerTechnologySaveData;
}

export default PlayerSaveData;
