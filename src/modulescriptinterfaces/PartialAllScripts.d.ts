import {PartialUnitScripts} from "./UnitScripts";
import {PartialGameScripts} from "./GameScripts";

interface AllPartialScripts
{
  unit?: PartialUnitScripts;
  game?: PartialGameScripts;
}

export default AllPartialScripts;
