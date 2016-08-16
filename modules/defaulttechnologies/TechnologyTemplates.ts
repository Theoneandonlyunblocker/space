import TechnologyTemplate from "../../src/templateinterfaces/TechnologyTemplate";
import TemplateCollection from "../../src/templateinterfaces/TemplateCollection";
import stealthShip from "../defaultunits/templates/stealthShip";

export const stealth: TechnologyTemplate =
{
  key: "stealth",
  displayName: "Stealth",
  description: "stealthy stuff"
}
export const lasers: TechnologyTemplate =
{
  key: "lasers",
  displayName: "Lasers",
  description: "pew pew"
}
export const missiles: TechnologyTemplate =
{
  key: "missiles",
  displayName: "Missiles",
  description: "boom"
}
export const test1: TechnologyTemplate =
{
  key: "test1",
  displayName: "test1",
  description: "test1"
}
export const test2: TechnologyTemplate =
{
  key: "test2",
  displayName: "test2",
  description: "test2"
}

const TechnologyTemplates: TemplateCollection<TechnologyTemplate> =
{
  [stealth.key]: stealth,
  [lasers.key]: lasers,
  [missiles.key]: missiles,
  [test1.key]: test1,
  [test2.key]: test2
}

export default TechnologyTemplates;
