import RaceTechnologyValue from "../../../src/templateinterfaces/RaceTechnologyValue";


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
