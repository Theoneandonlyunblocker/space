import { TemplateCollection } from "core/src/templateinterfaces/TemplateCollection";
import { CombatAbilityTemplate } from "core/src/templateinterfaces/CombatAbilityTemplate";
import { guardRow } from "./abilities/guardRow";
import { standby } from "./abilities/standby";


export const combatAbilityTemplates: TemplateCollection<CombatAbilityTemplate> =
{
  [guardRow.key]: guardRow,
  [standby.key]: standby,
};
