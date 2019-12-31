import { TitanChassisTemplate } from "./TitanChassisTemplate";
import { TitanComponentTemplate } from "./TitanComponentTemplate";
import { NonCoreModuleData } from "./nonCoreModuleData";
import { ManufacturableThing } from "core/src/templateinterfaces/ManufacturableThing";
import { Resources } from "core/src/player/PlayerResources";
import { sumObjectValues } from "core/src/generic/utility";
import { activeModuleData } from "core/src/app/activeModuleData";
import { Name } from "core/src/localization/Name";
import { NameSaveData } from "core/src/savedata/NameSaveData";


export type TitanPrototypeSaveData =
{
  type: string;
  name: NameSaveData;
  wasAiGenerated: boolean;
  chassisType: string;
  componentTypes: string[];
};

export class TitanPrototype implements ManufacturableThing
{
  public readonly type: string;
  public readonly name: Name;
  public get displayName()
  {
    return this.name.toString();
  }
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
    name: Name;
    chassis: TitanChassisTemplate;
    components: TitanComponentTemplate[];
  })
  {
    const idGenerators = (activeModuleData.nonCoreData.titans as NonCoreModuleData).idGenerators;

    this.type = props.type || "" + idGenerators.titanPrototype++;

    this.wasAiGenerated = props.wasAiGenerated;
    this.name = props.name;
    this.chassis = props.chassis;
    this.components = props.components;

    this.buildCost = sumObjectValues(
      this.chassis.buildCost,
      ...this.components.map(component => component.buildCost),
    );
  }

  public static fromData(saveData: TitanPrototypeSaveData): TitanPrototype
  {
    const titansModuleData = (activeModuleData.nonCoreData.titans as NonCoreModuleData);

    return new TitanPrototype(
    {
      type: saveData.type,
      name: Name.fromData(saveData.name),
      wasAiGenerated: saveData.wasAiGenerated,
      chassis: titansModuleData.titanChassis[saveData.chassisType],
      components: saveData.componentTypes.map(componentType => titansModuleData.titanComponents[componentType]),
    });
  }

  public serialize(): TitanPrototypeSaveData
  {
    return {
      type: this.type,
      name: this.name.serialize(),
      wasAiGenerated: this.wasAiGenerated,
      chassisType: this.chassis.type,
      componentTypes: this.components.map(component => component.type),
    };
  }
}
