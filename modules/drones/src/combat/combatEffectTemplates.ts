import { TemplateCollection } from "core/src/templateinterfaces/TemplateCollection";
import { CombatEffectTemplate } from "core/src/combat/CombatEffectTemplate";
import { infestation } from "./effects/infestation";
import { merge } from "./effects/merge";


export const combatEffectTemplates: TemplateCollection<CombatEffectTemplate> =
{
  [infestation.key]: infestation,
  [merge.key]: merge,
};
