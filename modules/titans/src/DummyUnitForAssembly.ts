import { TitanChassisTemplate } from "./TitanChassisTemplate";
import { Unit } from "core/src/unit/Unit";
import { activeModuleData } from "core/src/app/activeModuleData";
import { UnitAttributesObject, UnitAttributes } from "core/src/unit/UnitAttributes";
import { Player } from "core/src/player/Player";
import { TitanComponentTemplate, TitanComponentTemplatesBySlot } from "./TitanComponentTemplate";
import { Item } from "core/src/items/Item";


export class DummyUnitForAssembly
{
  private readonly lowStatsUnit: Unit;
  private readonly highStatsUnit: Unit;

  private itemIdGenerator: number = 0;

  constructor(chassis: TitanChassisTemplate, player: Player)
  {
    this.lowStatsUnit = DummyUnitForAssembly.makeUnit(chassis, player, "low");
    this.highStatsUnit = DummyUnitForAssembly.makeUnit(chassis, player, "high");
  }

  public getItemsAndEmptySlots(): TitanComponentTemplatesBySlot
  {
    const items = this.lowStatsUnit.items.getItemsAndEmptySlots();
    const components = Object.keys(items).reduce((allComponents, slot) =>
    {
      allComponents[slot] = items[slot].map(item => item.template);

      return allComponents;
    }, <TitanComponentTemplatesBySlot>{});

    return components;
  }
  public addItemAtPosition(componentTemplate: TitanComponentTemplate | undefined, position: number, slot: string): void
  {
    [this.lowStatsUnit, this.highStatsUnit].forEach(unit =>
    {
      if (componentTemplate)
      {
        const item = new Item(componentTemplate, this.itemIdGenerator++);
        unit.items.addItemAtPosition(item, position);
      }
      else
      {
        unit.items.removeItem(unit.items.getItemAtPosition(slot, position));
      }
    });
  }
  public removeAllItems(): void
  {
    [this.lowStatsUnit, this.highStatsUnit].forEach(unit =>
    {
      unit.items.getAllItems().forEach(item =>
      {
        unit.items.removeItem(item);
      });
    });
  }
  public getMinAndMaxPossibleHealth(): {min: number; max: number}
  {
    return {
      min: this.lowStatsUnit.maxHealth,
      max: this.highStatsUnit.maxHealth
    };
  }
  public getMinAndMaxPossibleAttributes(): {min: UnitAttributes; max: UnitAttributes}
  {
    return {
      min: this.lowStatsUnit.attributes,
      max: this.highStatsUnit.attributes
    };
  }

  private static makeUnit(
    chassis: TitanChassisTemplate,
    player: Player,
    type: "high" | "low",
  ): Unit
  {
    const ruleSet = activeModuleData.ruleSet.units;
    const round = type === "high" ? Math.ceil : Math.floor;

    const baseHealthValue = ruleSet.baseHealthValue;
    const healthVariance = ruleSet.healthVariance;
    const healthAdjust = type === "high" ?
      healthVariance :
      -1 * healthVariance;
    const health = round(baseHealthValue * chassis.maxHealthLevel + healthAdjust);

    const attributeLevels = chassis.attributeLevels;
    const baseAttributeValue = ruleSet.baseAttributeValue;
    const attributeVariance = ruleSet.attributeVariance;
    const attributeAdjust = type === "high" ?
      attributeVariance :
      -1 * attributeVariance;
    const attributes: UnitAttributesObject =
    {
      attack: round(attributeLevels.attack * baseAttributeValue + attributeAdjust),
      defence: round(attributeLevels.defence * baseAttributeValue + attributeAdjust),
      intelligence: round(attributeLevels.intelligence * baseAttributeValue + attributeAdjust),
      speed: round(attributeLevels.speed * baseAttributeValue + attributeAdjust),
      maxActionPoints: type === "high" ? ruleSet.maxActionPoints : ruleSet.minActionPoints,
    };

    const unit = Unit.fromTemplate(
    {
      template: chassis,
      race: player.race,
    });

    unit.maxHealth = health;
    for (const attribute in attributes)
    {
      unit.baseAttributes[attribute] = attributes[attribute];
    }

    return unit;
  }
}