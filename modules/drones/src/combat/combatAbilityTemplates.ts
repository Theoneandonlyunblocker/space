import { assimilate } from "./abilities/assimilate";
import { infest } from "./abilities/infest";
import { massRepair } from "./abilities/massRepair";
import { merge } from "./abilities/merge";
import { repair } from "./abilities/repair";


export const combatAbilityTemplates =
{
  [assimilate.key]: assimilate,
  [infest.key]: infest,
  [massRepair.key]: massRepair,
  [merge.key]: merge,
  [repair.key]: repair,
};
