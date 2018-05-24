import { UnlockableThingKind } from "../templateinterfaces/UnlockableThing";

declare interface ManufactorySaveData
{
  capacity: number;
  maxCapacity: number;
  unitStatsModifier: number;
  unitHealthModifier: number;
  buildQueue:
  {
    kind: UnlockableThingKind;
    templateType: string;
  }[];
}

export default ManufactorySaveData;
