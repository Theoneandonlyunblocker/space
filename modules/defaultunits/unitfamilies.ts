import UnitFamily from "../../src/templateinterfaces/UnitFamily";

export const debug: UnitFamily =
{
  type: "debug",
  debugOnly: true,
  alwaysAvailable: true,
  rarity: 0,
  distributionGroups: []
}
export const basic: UnitFamily =
{
  type: "basic",
  debugOnly: false,
  alwaysAvailable: true,
  rarity: 0,
  distributionGroups: []
}
export const red: UnitFamily =
{
  type: "red",
  debugOnly: false,
  alwaysAvailable: false,
  rarity: 1,
  distributionGroups: ["common", "rare"]
}
export const blue: UnitFamily =
{
  type: "blue",
  debugOnly: false,
  alwaysAvailable: false,
  rarity: 1,
  distributionGroups: ["common", "rare"]
}
