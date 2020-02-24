import { TemplateCollection } from "core/src/templateinterfaces/TemplateCollection";
import { CombatEffectTemplate } from "core/src/combat/CombatEffectTemplate";
import { infestation } from "./effects/infestation";
import { mergeBuff } from "./effects/mergeBuff";


export const combatEffectTemplates: TemplateCollection<CombatEffectTemplate> =
{
  [infestation.key]: infestation,
  [mergeBuff.key]: mergeBuff,
};
