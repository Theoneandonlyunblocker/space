import StatusEffectTemplate from "../../../src/templateinterfaces/StatusEffectTemplate";
import TemplateCollection from "../../../src/templateinterfaces/TemplateCollection";

import autoHeal from "./autoHeal";
import poisoned from "./poisoned";
import
{
  snipeAttack,
  snipeDefence,
  snipeIntelligence,
  snipeSpeed,
} from "./snipe";

export const statusEffectTemplates: TemplateCollection<StatusEffectTemplate> =
{
  [autoHeal.type]: autoHeal,
  [poisoned.type]: poisoned,
  [snipeAttack.type]: snipeAttack,
  [snipeDefence.type]: snipeDefence,
  [snipeIntelligence.type]: snipeIntelligence,
  [snipeSpeed.type]: snipeSpeed,
};
