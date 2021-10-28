import {unitArchetypes} from "modules/baselib/src/unitArchetypes";
import {unitTemplates} from "./unitTemplates";
import { ModuleData } from "core/src/modules/ModuleData";


export function addUnitsToModuleData(moduleData: ModuleData): void
{
  moduleData.templates.units.copyTemplates(unitTemplates);
  moduleData.templates.unitArchetypes.copyTemplates(unitArchetypes);
}
