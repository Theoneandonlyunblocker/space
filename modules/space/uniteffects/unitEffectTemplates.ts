import {TemplateCollection} from "core/templateinterfaces/TemplateCollection";
import {UnitEffectTemplate} from "core/templateinterfaces/UnitEffectTemplate";

import {autoHeal} from "./autoHeal";
import {poisoned} from "./poisoned";
import
{
  snipeAttack,
  snipeDefence,
  snipeIntelligence,
  snipeSpeed,
} from "./snipe";


export const unitEffectTemplates: TemplateCollection<UnitEffectTemplate> =
{
  [autoHeal.type]: autoHeal,
  [poisoned.type]: poisoned,
  [snipeAttack.type]: snipeAttack,
  [snipeDefence.type]: snipeDefence,
  [snipeIntelligence.type]: snipeIntelligence,
  [snipeSpeed.type]: snipeSpeed,
};
