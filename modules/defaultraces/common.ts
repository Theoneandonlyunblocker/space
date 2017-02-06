import * as TechnologyTemplates from "../defaulttechnologies/TechnologyTemplates";

import defaultUnits from "../defaultunits/UnitTemplates";

import RaceTechnologyValue from "../../src/templateinterfaces/RaceTechnologyValue";

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

  for (let key in valuesByTechKey)
  {
    mergedValues.push(valuesByTechKey[key]);
  }

  return mergedValues;
}

const defaultUnitsArray = Object.keys(defaultUnits).map(templateType =>
{
  return defaultUnits[templateType];
});
export function getDefaultUnits()
{
  return defaultUnitsArray;
}
