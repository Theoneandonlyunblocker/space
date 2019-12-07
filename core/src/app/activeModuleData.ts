import {ModuleData} from "../modules/ModuleData";

export let activeModuleData: ModuleData = new ModuleData();
export function clearActiveModuleData(): void
{
  activeModuleData = new ModuleData();
}
