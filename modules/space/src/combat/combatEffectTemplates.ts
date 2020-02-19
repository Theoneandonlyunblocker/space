import { TemplateCollection } from "core/src/templateinterfaces/TemplateCollection";
import { CombatEffectTemplate } from "core/src/combat/CombatEffectTemplate";
import { autoHeal } from "./effects/autoHeal";
import { poisoned } from "./effects/poisoned";
import { snipeAttack, snipeDefence, snipeIntelligence, snipeSpeed } from "./effects/snipe";


export const combatEffectTemplates: TemplateCollection<CombatEffectTemplate> =
{
  [autoHeal.key]: autoHeal,
  [poisoned.key]: poisoned,
  [snipeAttack.key]: snipeAttack,
  [snipeDefence.key]: snipeDefence,
  [snipeIntelligence.key]: snipeIntelligence,
  [snipeSpeed.key]: snipeSpeed,
};
