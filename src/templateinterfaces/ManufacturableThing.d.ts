import {UnlockableThing} from "./UnlockableThing";

declare interface ManufacturableThing extends UnlockableThing
{
  type: string;
  displayName: string;
  description: string;
  buildCost: number;
}

export default ManufacturableThing;
