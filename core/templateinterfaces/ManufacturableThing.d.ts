import {UnlockableThing} from "./UnlockableThing";

export interface ManufacturableThing extends UnlockableThing
{
  type: string;
  displayName: string;
  description: string;
  buildCost: number;
}
