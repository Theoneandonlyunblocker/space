import { TitanComponent } from "./TitanComponent";
import { TemplateCollection } from "core/src/templateinterfaces/TemplateCollection";
import { ModuleData } from "core/src/modules/ModuleData";


export type NonCoreModuleData =
{
  titanComponents: TemplateCollection<TitanComponent>;
  getBuildableTitanComponentsForRace:
  {
    [raceKey: string]: () => TitanComponent[];
  };
};

const nonCoreModuleData: NonCoreModuleData =
{
  titanComponents: {},
  getBuildableTitanComponentsForRace: {},
};

export function copyNonCoreModuleData(): NonCoreModuleData
{
  return {
    titanComponents: {...nonCoreModuleData.titanComponents},
    getBuildableTitanComponentsForRace: {...nonCoreModuleData.getBuildableTitanComponentsForRace},
  };
}

export function addTitanComponentsToModuleData(
  moduleData: ModuleData,
  componentsToAdd: TemplateCollection<TitanComponent>,
): void
{
  const existingComponents = (moduleData.nonCoreData.titans as NonCoreModuleData).titanComponents;

  for (const key in componentsToAdd)
  {
    if (existingComponents[key])
    {
      throw new Error(`Duplicate titan component template '${key}'`);
    }

    existingComponents[key] = componentsToAdd[key];
  }

  moduleData.technologyUnlocksAreDirty = true;
}
