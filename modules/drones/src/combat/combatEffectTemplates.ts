import { infestation } from "./effects/infestation";
import { mergeBuff } from "./effects/mergeBuff";


export const combatEffectTemplates =
{
  [infestation.key]: infestation,
  [mergeBuff.key]: mergeBuff,
};
