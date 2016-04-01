import Distributable from "./Distributable.ts";
import UnitTemplate from "./UnitTemplate.ts";

declare interface UnitFamily extends Distributable
{
  type: string;
  debugOnly: boolean;
  alwaysAvailable: boolean;
  
  associatedTemplates?: UnitTemplate[]; //set dynamically
}

export default UnitFamily;
