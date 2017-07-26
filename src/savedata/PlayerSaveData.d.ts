import AIControllerSaveData from "./AIControllerSaveData";
import ColorSaveData from "./ColorSaveData";
import DiplomacyStatusSaveData from "./DiplomacyStatusSaveData";
import FlagSaveData from "./FlagSaveData";
import FleetSaveData from "./FleetSaveData";
import NameSaveData from "./NameSaveData";
import PlayerTechnologySaveData from "./PlayerTechnologySaveData";

declare interface PlayerSaveData
{
  id: number;
  name: NameSaveData;
  color: ColorSaveData;
  colorAlpha: number;
  secondaryColor: ColorSaveData;
  isIndependent: boolean;
  resources:
  {
    [resourceType: string]: number;
  };
  diplomacyStatus?: DiplomacyStatusSaveData;

  flag?: FlagSaveData;

  unitIds: number[];
  fleets: FleetSaveData[];
  money: number;
  controlledLocationIds: number[];
  itemIds: number[];
  revealedStarIds: number[];
  identifiedUnitIds: number[];
  researchByTechnology?: PlayerTechnologySaveData;
  raceKey: string;
  isDead: boolean;

  isAI: boolean;
  AIController?: AIControllerSaveData<any>;
}

export default PlayerSaveData;
