import {AbilityTemplate} from "src/templateinterfaces/AbilityTemplate";
import {TemplateCollection} from "src/templateinterfaces/TemplateCollection";

import {assimilate} from "./abilities/assimilate";
import {merge} from "./abilities/merge";
import {infest} from "./abilities/infest";
import {repair} from "./abilities/repair";
import {massRepair} from "./abilities/massRepair";


export const abilityTemplates: TemplateCollection<AbilityTemplate> =
{
  [assimilate.type]: assimilate,
  [merge.type]: merge,
  [infest.type]: infest,
  [repair.type]: repair,
  [massRepair.type]: massRepair,
};
