import { beamAttack } from "./abilities/beamAttack";
import { boardingHook } from "./abilities/boardingHook";
import { bombAttack } from "./abilities/bombAttack";
import { closeAttack } from "./abilities/closeAttack";
import { rangedAttack } from "./abilities/rangedAttack";
import
{
  snipeAttack,
  snipeDefence,
  snipeIntelligence,
  snipeSpeed,
} from "./abilities/snipe";


export const combatAbilityTemplates =
{
  beamAttack: beamAttack,
  boardingHook: boardingHook,
  bombAttack: bombAttack,
  closeAttack: closeAttack,
  rangedAttack: rangedAttack,
  snipeAttack: snipeAttack,
  snipeDefence: snipeDefence,
  snipeIntelligence: snipeIntelligence,
  snipeSpeed: snipeSpeed,
};
