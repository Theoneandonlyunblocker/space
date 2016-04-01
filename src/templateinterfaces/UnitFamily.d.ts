import Distributable from "./Distributable.d.ts";
import UnitTemplate from "./UnitTemplate.d.ts";

declare interface UnitFamily extends Distributable
{
  type: string;
  debugOnly: boolean;
  alwaysAvailable: boolean;
  
  associatedTemplates?: UnitTemplate[]; //set dynamically
}

export default UnitFamily;
