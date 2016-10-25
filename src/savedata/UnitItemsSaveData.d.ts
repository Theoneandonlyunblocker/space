import ItemSaveData from "./ItemSaveData";

declare interface UnitItemsSaveData
{
  maxItemSlots:
  {
    [slot: string]: number;
  };
  itemIDs: number[];
}

export default UnitItemsSaveData;
