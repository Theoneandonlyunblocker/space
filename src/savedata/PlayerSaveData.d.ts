import AiControllerSaveData from "./AIControllerSaveData";
import ColorSaveData from "./ColorSaveData";
import FlagSaveData from "./FlagSaveData";
import FleetSaveData from "./FleetSaveData";
import NameSaveData from "./NameSaveData";
import {NotificationSubscriberSaveData} from "./NotificationSubscriberSaveData";
import PlayerDiplomacySaveData from "./PlayerDiplomacySaveData";
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
  diplomacyData?: PlayerDiplomacySaveData;

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

  isAi: boolean;
  AiController?: AiControllerSaveData<any>;

  notificationLog: NotificationSubscriberSaveData | null;
}

export default PlayerSaveData;
