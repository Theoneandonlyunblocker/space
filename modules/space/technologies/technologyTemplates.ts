import {TechnologyTemplate} from "src/templateinterfaces/TechnologyTemplate";
import {TemplateCollection} from "src/templateinterfaces/TemplateCollection";
import { localize } from "./localization/localize";


export const stealth: TechnologyTemplate =
{
  key: "stealth",
  get displayName()
  {
    return localize("stealth_displayName").toString();
  },
  get description()
  {
    return localize("stealth_description").toString();
  },
  maxLevel: 9,
};
export const lasers: TechnologyTemplate =
{
  key: "lasers",
  get displayName()
  {
    return localize("lasers_displayName").toString();
  },
  get description()
  {
    return localize("lasers_description").toString();
  },
  maxLevel: 9,
};
export const missiles: TechnologyTemplate =
{
  key: "missiles",
  get displayName()
  {
    return localize("missiles_displayName").toString();
  },
  get description()
  {
    return localize("missiles_description").toString();
  },
  maxLevel: 9,
};
export const test1: TechnologyTemplate =
{
  key: "test1",
  get displayName()
  {
    return localize("test1_displayName").toString();
  },
  get description()
  {
    return localize("test1_description").toString();
  },
  maxLevel: 1,
};
export const test2: TechnologyTemplate =
{
  key: "test2",
  get displayName()
  {
    return localize("test2_displayName").toString();
  },
  get description()
  {
    return localize("test2_description").toString();
  },
  maxLevel: 2,
};

export const technologyTemplates: TemplateCollection<TechnologyTemplate> =
{
  [stealth.key]: stealth,
  [lasers.key]: lasers,
  [missiles.key]: missiles,
  [test1.key]: test1,
  [test2.key]: test2,
};
