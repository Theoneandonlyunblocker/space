import TechnologyTemplate from "../../src/templateinterfaces/TechnologyTemplate";
import TemplateCollection from "../../src/templateinterfaces/TemplateCollection";
import stealthShip from "../defaultunits/templates/stealthShip";


export const stealth: TechnologyTemplate =
{
  key: "stealth",
  displayName: "Stealth",
  description: "stealthy stuff",
  maxLevel: 9,
  unlocksPerLevel:
  {
    1: [stealthShip],
  },
};
export const lasers: TechnologyTemplate =
{
  key: "lasers",
  displayName: "Lasers",
  description: "pew pew",
  maxLevel: 9,
  unlocksPerLevel: {},
};
export const missiles: TechnologyTemplate =
{
  key: "missiles",
  displayName: "Missiles",
  description: "boom",
  maxLevel: 9,
  unlocksPerLevel: {},
};
export const test1: TechnologyTemplate =
{
  key: "test1",
  displayName: "test1",
  description: "test1",
  maxLevel: 1,
  unlocksPerLevel: {},
};
export const test2: TechnologyTemplate =
{
  key: "test2",
  displayName: "test2",
  description: "test2",
  maxLevel: 2,
  unlocksPerLevel: {},
};

const technologyTemplates: TemplateCollection<TechnologyTemplate> =
{
  [stealth.key]: stealth,
  [lasers.key]: lasers,
  [missiles.key]: missiles,
  [test1.key]: test1,
  [test2.key]: test2,
};

export default technologyTemplates;
