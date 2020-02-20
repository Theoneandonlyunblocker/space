import {AbilityTemplate} from "core/src/templateinterfaces/AbilityTemplate";
import {TemplateCollection} from "core/src/templateinterfaces/TemplateCollection";

import {assimilate} from "./abilities/assimilate";
import {merge} from "./abilities/merge";
import {infest} from "./abilities/infest";


export const abilityTemplates: TemplateCollection<AbilityTemplate> =
{
  [assimilate.type]: assimilate,
  [merge.type]: merge,
  [infest.type]: infest,
};
