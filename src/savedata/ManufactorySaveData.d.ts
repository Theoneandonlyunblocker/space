import { UnlockableThingKind } from "../templateinterfaces/UnlockableThing";

export interface ManufactorySaveData
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
