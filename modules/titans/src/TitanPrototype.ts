import { TitanChassisTemplate } from "./TitanChassisTemplate";
import { TitanComponentTemplate } from "./TitanComponentTemplate";
import { ModuleData } from "core/src/modules/ModuleData";
import { NonCoreModuleData } from "./nonCoreModuleData";


export type TitanPrototype =
{
  wasAiGenerated: boolean;
  key: string;
  displayName: string;
  chassis: TitanChassisTemplate;
  components: TitanComponentTemplate[];
};
export type TitanPrototypeSaveData =
{
  wasAiGenerated: boolean;
  key: string;
  displayName: string;
  chassisType: string;
  componentTypes: string[];
};
export function serializeTitanPrototype(prototype: TitanPrototype): TitanPrototypeSaveData
{
  return {
    wasAiGenerated: prototype.wasAiGenerated,
    key: prototype.key,
    displayName: prototype.displayName,
    chassisType: prototype.chassis.type,
    componentTypes: prototype.components.map(component => component.type),
  };
}
export function deserializeTitanPrototype(moduleData: ModuleData, saveData: TitanPrototypeSaveData): TitanPrototype
{
  const titansModuleData = (moduleData.nonCoreData.titans as NonCoreModuleData);

  return {
    wasAiGenerated: saveData.wasAiGenerated,
    key: saveData.key,
    displayName: saveData.displayName,
    chassis: titansModuleData.titanChassis[saveData.chassisType],
    components: saveData.componentTypes.map(componentType => titansModuleData.titanComponents[componentType]),
  };
}
