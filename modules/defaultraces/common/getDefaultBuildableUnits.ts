import defaultUnits from "../../defaultunits/unitTemplates";
import debugShip from "../../defaultunits/templates/debugShip";
import Options from "../../../src/Options";
import UnitTemplate from "../../../src/templateinterfaces/UnitTemplate";


const defaultUnitsArray = Object.keys(defaultUnits).map(templateType =>
{
  return defaultUnits[templateType];
}).filter(unitTemplate =>
{
  return unitTemplate !== debugShip;
});

export function getDefaultBuildableUnits(): UnitTemplate[]
{
  const availableUnits = [...defaultUnitsArray];

  if (Options.debug.enabled)
  {
    availableUnits.push(debugShip);
  }

  return availableUnits;
}
