import ModuleData from "../../src/ModuleData";

import * as AbilityTemplates from  "./abilitytemplates/abilities";
import * as BattleSFXTemplates from  "./battlesfxtemplates/battleSFX";
import * as PassiveSkillTemplates from  "./passiveskilltemplates/passiveSkills";
import * as ResourceTemplates from  "./resourcetemplates/resources";
import {statusEffectTemplates} from  "./statuseffecttemplates/statusEffectTemplates";

import {attachedUnitDataScripts} from "./attachedUnitData";

export default function addCommonToModuleData(moduleData: ModuleData)
{
  moduleData.copyTemplates<any>(AbilityTemplates, "Abilities");
  moduleData.copyTemplates<any>(ResourceTemplates, "Resources");
  moduleData.copyTemplates<any>(BattleSFXTemplates, "BattleSFX");
  moduleData.copyTemplates<any>(PassiveSkillTemplates, "PassiveSkills");

  moduleData.copyTemplates<any>(statusEffectTemplates, "StatusEffects");

  moduleData.scripts.add(attachedUnitDataScripts);
}
