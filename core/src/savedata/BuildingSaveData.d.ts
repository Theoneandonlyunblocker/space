import { Resources } from "../player/PlayerResources";


export interface BuildingSaveData
{
  templateType: string;
  id: number;

  locationId: number;
  controllerId: number;

  totalCost: Resources;
}
