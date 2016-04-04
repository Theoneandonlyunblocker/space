import ItemSaveData from "./ItemSaveData.d.ts";

declare interface UnitItemsSaveData
{
  [slot: string]: ItemSaveData;
}

export default UnitItemsSaveData;
