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
  key: string;
  name: NameSaveData;
  wasAiGenerated: boolean;
  chassis: string;
  components: string[];
};

export class TitanPrototype implements ManufacturableThing
{
  public readonly key: string;
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
    key?: string;
    wasAiGenerated: boolean;
    name: Name;
    chassis: TitanChassisTemplate;
    components: TitanComponentTemplate[];
  })
  {
    const idGenerators = (activeModuleData.nonCoreData.titans as NonCoreModuleData).idGenerators;

    this.key = props.key || "" + idGenerators.titanPrototype++;

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
      key: saveData.key,
      name: Name.fromData(saveData.name),
      wasAiGenerated: saveData.wasAiGenerated,
      chassis: titansModuleData.titanChassis.get(saveData.chassis),
      components: saveData.components.map(componentType => titansModuleData.titanComponents.get(componentType)),
    });
  }

  public serialize(): TitanPrototypeSaveData
  {
    return {
      key: this.key,
      name: this.name.serialize(),
      wasAiGenerated: this.wasAiGenerated,
      chassis: this.chassis.key,
      components: this.components.map(component => component.key),
    };
  }
}
