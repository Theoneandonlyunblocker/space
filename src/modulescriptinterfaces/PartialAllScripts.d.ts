import {PartialGameScripts} from "./GameScripts";
import {PartialUnitScripts} from "./UnitScripts";

interface AllPartialScripts
{
  unit?: PartialUnitScripts;
  game?: PartialGameScripts;
}

export default AllPartialScripts;
