import {unitTemplates as units} from "modules/space/src/units/unitTemplates";
import {debugShip} from "modules/space/src/units/templates/debugShip";
import {options} from "core/src/app/Options";
import {UnitTemplate} from "core/src/templateinterfaces/UnitTemplate";


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
    units.miningBarge,
  ];

  if (options.debug.enabled)
  {
    availableUnits.push(debugShip);
  }

  return availableUnits;
}
