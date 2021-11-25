import { blockNegativeEffect } from "./effects/blockNegativeEffect";
import { lifeLeechMultiplier } from "./effects/lifeLeechMultiplier";


export const combatEffectTemplates =
{
  [blockNegativeEffect.key]: blockNegativeEffect,
  [lifeLeechMultiplier.key]: lifeLeechMultiplier,
};
