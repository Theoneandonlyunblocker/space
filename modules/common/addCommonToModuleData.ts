import ModuleData from "../../src/ModuleData";

import * as AbilityTemplates from  "./abilitytemplates/abilities";
import * as ResourceTemplates from  "./resourcetemplates/resources";
import * as EffectActionTemplates from  "./effectactiontemplates/effectActions";
import poisoned from  "./statuseffecttemplates/poisoned";
import * as BattleSFXTemplates from  "./battlesfxtemplates/battleSFX";
import * as PassiveSkillTemplates from  "./passiveskilltemplates/passiveSkills";

import {attachedUnitDataScripts} from "./attachedUnitData";

export default function addCommonToModuleData(moduleData: ModuleData)
{
  moduleData.copyTemplates<any>(AbilityTemplates, "Abilities");
  moduleData.copyTemplates<any>(ResourceTemplates, "Resources");
  moduleData.copyTemplates<any>(EffectActionTemplates, "EffectActions");
  moduleData.copyTemplates<any>(BattleSFXTemplates, "BattleSFX");
  moduleData.copyTemplates<any>(PassiveSkillTemplates, "PassiveSkills");
  
  moduleData.copyTemplates<any>({[poisoned.type]: poisoned}, "StatusEffects");
  
  moduleData.scripts.add(attachedUnitDataScripts);
}