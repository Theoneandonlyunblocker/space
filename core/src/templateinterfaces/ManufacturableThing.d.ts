import {UnlockableThing} from "./UnlockableThing";
import { Resources } from "../player/PlayerResources";

export interface ManufacturableThing extends UnlockableThing
{
  type: string;
  displayName: string;
  description: string;
  buildCost: Resources;
}
