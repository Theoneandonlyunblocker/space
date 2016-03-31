declare interface BuildingSaveData
{
  templateType: string;
  id: number;

  locationId: number;
  controllerId: number;

  upgradeLevel: number;
  totalCost: number;
}

export default BuildingSaveData;
