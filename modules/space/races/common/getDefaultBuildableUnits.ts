import {unitTemplates as units} from "../../units/unitTemplates";
import {debugShip} from "../../units/templates/debugShip";
import {options} from "../../../../src/Options";
import {UnitTemplate} from "../../../../src/templateinterfaces/UnitTemplate";


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

  if (options.debug.enabled)
  {
    availableUnits.push(debugShip);
  }

  return availableUnits;
}
