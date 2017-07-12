import ItemSaveData from "./ItemSaveData";

declare interface UnitItemsSaveData
{
  maxItemSlots:
  {
    [slot: string]: number;
  };
  itemIds: number[];
}

export default UnitItemsSaveData;
