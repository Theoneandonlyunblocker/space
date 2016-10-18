import TemplateCollection from "../../src/templateinterfaces/TemplateCollection";
import UnitFamily from "../../src/templateinterfaces/UnitFamily";

export const drone: UnitFamily =
{
  type: "drone",
  debugOnly: false,
  alwaysAvailable: true,
  rarity: 1,
  distributionGroups: ["common", "rare"],
};

export const unitFamilies: TemplateCollection<UnitFamily> =
{
  [drone.type]: drone,
};
