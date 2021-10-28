import {itemTemplates} from "./itemTemplates";
import { ModuleData } from "core/src/modules/ModuleData";


export function addItemsToModuleData(moduleData: ModuleData): void
{
  moduleData.templates.items.copyTemplates(itemTemplates);
}


