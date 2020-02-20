import { TemplateCollection } from "core/src/templateinterfaces/TemplateCollection";
import { CombatAbilityTemplate } from "core/src/templateinterfaces/CombatAbilityTemplate";
import { repair } from "../abilities/repair";


export const combatAbilityTemplates: TemplateCollection<CombatAbilityTemplate> =
{
  [repair.key]: repair,
};
