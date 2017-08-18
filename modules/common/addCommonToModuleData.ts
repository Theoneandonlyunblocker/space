import ModuleData from "../../src/ModuleData";

import * as AbilityTemplates from  "./abilitytemplates/abilities";
import * as BattleSFXTemplates from  "./battlesfxtemplates/battleSFX";
import * as PassiveSkillTemplates from  "./passiveskilltemplates/passiveSkills";
import * as ResourceTemplates from  "./resourcetemplates/resources";
import * as TerrainTemplates from  "./terraintemplates/terrains";
import {unitEffectTemplates} from  "./uniteffecttemplates/unitEffectTemplates";

import {attachedUnitDataScripts} from "./attachedUnitData";

export default function addCommonToModuleData(moduleData: ModuleData)
{
  // TODO 2017.06.13 | none of these have supported languages set
  moduleData.copyTemplates<any>(AbilityTemplates, "Abilities");
  moduleData.copyTemplates<any>(ResourceTemplates, "Resources");
  moduleData.copyTemplates<any>(BattleSFXTemplates, "BattleSFX");
  moduleData.copyTemplates<any>(PassiveSkillTemplates, "PassiveSkills");
  moduleData.copyTemplates<any>(TerrainTemplates, "Terrains");
  moduleData.copyTemplates<any>(unitEffectTemplates, "UnitEffects");

  moduleData.scripts.add(attachedUnitDataScripts);
}
