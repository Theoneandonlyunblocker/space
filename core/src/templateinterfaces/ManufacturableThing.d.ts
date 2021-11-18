import {UnlockableThing} from "./UnlockableThing";
import { Resources } from "../player/PlayerResources";
import { Manufactory } from "../production/Manufactory";


export interface ManufacturableThing extends UnlockableThing
{
  key: string;
  displayName: string;
  description: string;
  buildCost: Resources;
}

export interface ManufacturableThingKind<
  Template extends ManufacturableThing,
  BuiltThing,
  SaveData
>
{
  key: string;
  buildFromTemplate: (template: Template, manufactory: Manufactory) => BuiltThing;
  afterBuilt: (builtThings: BuiltThing[], manufactory: Manufactory) => void;
  serialize: (template: Template) => SaveData;
  deserialize: (saveData: SaveData) => Template;
}
