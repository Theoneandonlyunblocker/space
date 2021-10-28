import { autoHeal } from "./effects/autoHeal";
import { poisoned } from "./effects/poisoned";
import { snipeAttack, snipeDefence, snipeIntelligence, snipeSpeed } from "./effects/snipe";


export const combatEffectTemplates =
{
  [autoHeal.key]: autoHeal,
  [poisoned.key]: poisoned,
  [snipeAttack.key]: snipeAttack,
  [snipeDefence.key]: snipeDefence,
  [snipeIntelligence.key]: snipeIntelligence,
  [snipeSpeed.key]: snipeSpeed,
};
