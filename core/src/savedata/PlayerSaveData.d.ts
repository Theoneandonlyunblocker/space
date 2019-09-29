import {AiControllerSaveData} from "./AiControllerSaveData";
import {ColorSaveData} from "./ColorSaveData";
import {FlagSaveData} from "./FlagSaveData";
import {FleetSaveData} from "./FleetSaveData";
import {NameSaveData} from "./NameSaveData";
import {NotificationSubscriberSaveData} from "./NotificationSubscriberSaveData";
import {PlayerDiplomacySaveData} from "./PlayerDiplomacySaveData";
import {PlayerTechnologySaveData} from "./PlayerTechnologySaveData";
import {Resources} from "../player/PlayerResources";

export interface PlayerSaveData
{
  id: number;
  name: NameSaveData;
  color: ColorSaveData;
  colorAlpha: number;
  secondaryColor: ColorSaveData;
  isIndependent: boolean;
  resources: Resources;
  diplomacyData?: PlayerDiplomacySaveData;

  flag?: FlagSaveData;

  unitIds: number[];
  fleets: FleetSaveData[];
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
