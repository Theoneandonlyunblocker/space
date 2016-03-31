declare namespace Rance
{
  interface IBuildingSaveData
  {
    templateType: string;
    id: number;

    locationId: number;
    controllerId: number;

    upgradeLevel: number;
    totalCost: number;
  }
}
