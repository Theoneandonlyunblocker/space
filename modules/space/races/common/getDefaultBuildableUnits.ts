import {unitTemplates as units} from "../../units/unitTemplates";
import debugShip from "../../units/templates/debugShip";
import Options from "../../../../src/Options";
import UnitTemplate from "../../../../src/templateinterfaces/UnitTemplate";


export function getDefaultBuildableUnits(): UnitTemplate[]
{
  const availableUnits =
  [
    units.battleCruiser,
    units.stealthShip,
    units.scout,
    units.bomberSquadron,
    // units.fighterSquadron,
    units.shieldBoat,
  ];

  if (Options.debug.enabled)
  {
    availableUnits.push(debugShip);
  }

  return availableUnits;
}
