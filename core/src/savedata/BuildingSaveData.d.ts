import { Resources } from "../player/PlayerResources";


export interface BuildingSaveData
{
  template: string;
  id: number;

  locationId: number;
  controllerId: number;

  totalCost: Resources;
}
