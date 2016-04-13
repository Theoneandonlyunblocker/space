import Distributable from "./Distributable";
import UnitTemplate from "./UnitTemplate";

declare interface UnitFamily extends Distributable
{
  type: string;
  debugOnly: boolean;
  alwaysAvailable: boolean;
  
  associatedTemplates?: UnitTemplate[]; //set dynamically
}

export default UnitFamily;
