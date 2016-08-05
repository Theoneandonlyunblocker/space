import ItemSaveData from "./ItemSaveData";

declare interface UnitItemsSaveData
{
  maxItemSlots:
  {
    [slot: string]: number;
  }
}

export default UnitItemsSaveData;
