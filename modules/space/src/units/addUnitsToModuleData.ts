import {unitArchetypes} from "modules/baselib/src/unitArchetypes";
import {unitTemplates} from "./unitTemplates";
import { ModuleData } from "core/src/modules/ModuleData";


export function addUnitsToModuleData(moduleData: ModuleData): void
{
  moduleData.copyTemplates(unitTemplates, "units");
  moduleData.copyTemplates(unitArchetypes, "unitArchetypes");
}
