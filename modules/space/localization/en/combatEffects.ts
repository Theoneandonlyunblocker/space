import { snipeAttributeAdjustment } from "modules/space/src/combat/effects/snipe";

const snipeReductionPercentage = snipeAttributeAdjustment.multiplicativeMultiplier * 100;

export const combatEffects =
{
  combatEffect_autoHeal_displayName: "Auto heal",
  combatEffect_autoHeal_description: "Restore {0} health after every action",
  combatEffect_poisoned_displayName: "Poisoned",
  combatEffect_poisoned_description: "Take {0} poison damage after every action",
  combatEffect_snipeAttack_displayName: "Sniped Attack",
  combatEffect_snipeAttack_description: `Reduce attack by ${snipeReductionPercentage}%`,
  combatEffect_snipeDefence_displayName: "Sniped Defence",
  combatEffect_snipeDefence_description: `Reduce defence by ${snipeReductionPercentage}%`,
  combatEffect_snipeIntelligence_displayName: "Sniped Intelligence",
  combatEffect_snipeIntelligence_description: `Reduce intelligence by ${snipeReductionPercentage}%`,
  combatEffect_snipeSpeed_displayName: "Sniped Speed",
  combatEffect_snipeSpeed_description: `Reduce speed by ${snipeReductionPercentage}%`,
};
