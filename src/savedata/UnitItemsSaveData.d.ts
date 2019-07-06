import {ItemSaveData} from "./ItemSaveData";

export interface UnitItemsSaveData
{
  maxItemSlots:
  {
    [slot: string]: number;
  };
  itemIds: number[];
}
