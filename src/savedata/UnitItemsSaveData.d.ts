import ItemSaveData from "./ItemSaveData";

declare interface UnitItemsSaveData
{
  [slot: string]: ItemSaveData;
}

export default UnitItemsSaveData;
