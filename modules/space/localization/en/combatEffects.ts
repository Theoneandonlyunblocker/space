import { snipeAttributeAdjustment } from "modules/space/src/combat/effects/snipe";

const snipeReductionPercentage = snipeAttributeAdjustment.multiplicativeMultiplier * 100;

export const combatEffects =
{
  effect_autoHeal_displayName: "Auto heal",
  effect_autoHeal_description: "Restore {0} health after every action",
  effect_poisoned_displayName: "Poisoned",
  effect_poisoned_description: "Take {0} poison damage after every action",
  effect_snipeAttack_displayName: "Sniped Attack",
  effect_snipeAttack_description: `Reduce attack by ${snipeReductionPercentage}%`,
  effect_snipeDefence_displayName: "Sniped Defence",
  effect_snipeDefence_description: `Reduce defence by ${snipeReductionPercentage}%`,
  effect_snipeIntelligence_displayName: "Sniped Intelligence",
  effect_snipeIntelligence_description: `Reduce intelligence by ${snipeReductionPercentage}%`,
  effect_snipeSpeed_displayName: "Sniped Speed",
  effect_snipeSpeed_description: `Reduce speed by ${snipeReductionPercentage}%`,
};
