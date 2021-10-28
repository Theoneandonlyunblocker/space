import { guardRow } from "./abilities/guardRow";
import { standby } from "./abilities/standby";


export const combatAbilityTemplates = {
  [guardRow.key]: guardRow,
  [standby.key]: standby,
};
