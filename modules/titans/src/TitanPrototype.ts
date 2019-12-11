import { TitanChassisTemplate } from "./TitanChassisTemplate";
import { TitanComponentTemplate } from "./TitanComponentTemplate";
import { ModuleData } from "core/src/modules/ModuleData";
import { NonCoreModuleData } from "./nonCoreModuleData";
import { ManufacturableThing } from "core/src/templateinterfaces/ManufacturableThing";
import { Resources } from "core/src/player/PlayerResources";
import { sumObjectValues } from "core/src/generic/utility";
import { activeModuleData } from "core/src/app/activeModuleData";


export type TitanPrototypeSaveData =
{
  type: string;
  displayName: string;
  wasAiGenerated: boolean;
  chassisType: string;
  componentTypes: string[];
};

export class TitanPrototype implements ManufacturableThing
{
  public readonly type: string;
  public readonly displayName: string;
  public readonly wasAiGenerated: boolean;
  public readonly chassis: TitanChassisTemplate;
  public readonly components: TitanComponentTemplate[];

  public readonly buildCost: Resources;
  // TODO 2019.12.08 | implement
  public readonly description: string = "";

  constructor(props:
  {
    type?: string;
    wasAiGenerated: boolean;
    displayName: string;
    chassis: TitanChassisTemplate;
    components: TitanComponentTemplate[];
  })
  {
    const idGenerators = (activeModuleData.nonCoreData.titans as NonCoreModuleData).idGenerators;

    this.type = props.type || "" + idGenerators.titanPrototype++;

    this.wasAiGenerated = props.wasAiGenerated;
    this.displayName = props.displayName;
    this.chassis = props.chassis;
    this.components = props.components;

    this.buildCost = sumObjectValues(
      this.chassis.buildCost,
      ...this.components.map(component => component.buildCost),
    );
  }

  public static fromData(moduleData: ModuleData, saveData: TitanPrototypeSaveData): TitanPrototype
  {
    const titansModuleData = (moduleData.nonCoreData.titans as NonCoreModuleData);

    return new TitanPrototype(
    {
      type: saveData.type,
      displayName: saveData.displayName,
      wasAiGenerated: saveData.wasAiGenerated,
      chassis: titansModuleData.titanChassis[saveData.chassisType],
      components: saveData.componentTypes.map(componentType => titansModuleData.titanComponents[componentType]),
    });
  }

  public serialize(): TitanPrototypeSaveData
  {
    return {
      type: this.type,
      displayName: this.displayName,
      wasAiGenerated: this.wasAiGenerated,
      chassisType: this.chassis.type,
      componentTypes: this.components.map(component => component.type),
    };
  }
}
