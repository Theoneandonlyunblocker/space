import * as TechnologyTemplates from "../defaulttechnologies/TechnologyTemplates";

import defaultUnits from "../defaultunits/UnitTemplates";
import debugShip from "../defaultunits/templates/debugShip";

import RaceTechnologyValue from "../../src/templateinterfaces/RaceTechnologyValue";

import Options from "../../src/Options";


export const defaultRaceTechnologyValues: RaceTechnologyValue[] =
[
  {
    tech: TechnologyTemplates.stealth,
    startingLevel: 0,
    maxLevel: 9,
  },
  {
    tech: TechnologyTemplates.lasers,
    startingLevel: 0,
    maxLevel: 9,
  },
  {
    tech: TechnologyTemplates.missiles,
    startingLevel: 0,
    maxLevel: 9,
  },
];

export function mergeTechnologyValues(...valuesToMerge: RaceTechnologyValue[][]): RaceTechnologyValue[]
{
  const valuesByTechKey:
  {
    [key: string]: RaceTechnologyValue;
  } = {};

  valuesToMerge.forEach(techValues =>
  {
    techValues.forEach(techValue =>
    {
      valuesByTechKey[techValue.tech.key] = techValue;
    });
  });

  const mergedValues: RaceTechnologyValue[] = [];

  for (const key in valuesByTechKey)
  {
    mergedValues.push(valuesByTechKey[key]);
  }

  return mergedValues;
}

const defaultUnitsArray = Object.keys(defaultUnits).map(templateType =>
{
  return defaultUnits[templateType];
}).filter(unitTemplate =>
{
  return unitTemplate !== debugShip;
});

export function getDefaultUnits()
{
  const availableUnits = [...defaultUnitsArray];

  if (Options.debug.enabled)
  {
    availableUnits.push(debugShip);
  }

  return availableUnits;
}
