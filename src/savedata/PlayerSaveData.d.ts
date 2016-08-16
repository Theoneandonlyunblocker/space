import DiplomacyStatusSaveData from "./DiplomacyStatusSaveData";
import FlagSaveData from "./FlagSaveData";
import FleetSaveData from "./FleetSaveData";
import ItemSaveData from "./ItemSaveData";
import PlayerTechnologySaveData from "./PlayerTechnologySaveData";
import ColorSaveData from "./ColorSaveData";
import NameSaveData from "./NameSaveData";
import Personality from "../Personality";

declare interface PlayerSaveData
{
  id: number;
  name: NameSaveData;
  color: ColorSaveData;
  colorAlpha: number;
  secondaryColor: ColorSaveData;
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
  raceKey: string;
}

export default PlayerSaveData;
