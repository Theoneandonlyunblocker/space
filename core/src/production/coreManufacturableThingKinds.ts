import { ManufacturableThingKind } from "../templateinterfaces/ManufacturableThing";
import { ItemTemplate } from "../templateinterfaces/ItemTemplate";
import { Item } from "../items/Item";
import { UnitTemplate } from "../templateinterfaces/UnitTemplate";
import { Unit } from "../unit/Unit";
import { Fleet } from "../fleets/Fleet";
import { activeModuleData } from "../app/activeModuleData";


const item: ManufacturableThingKind<ItemTemplate, Item, string> =
{
  key: "item",
  buildFromTemplate: (itemTemplate, manufactory) =>
  {
    return new Item(itemTemplate);
  },
  afterBuilt: (builtItems, manufactory) =>
  {
    builtItems.forEach(builtItem =>
    {
      manufactory.owner.addItem(builtItem);
      builtItem.modifiers.handleConstruct();
    });
  },
  serialize: (template) => template.key,
  deserialize: (templateType) => activeModuleData.templates.items.get(templateType),
};
const unit: ManufacturableThingKind<UnitTemplate, Unit, string> =
{
  key: "unit",
  buildFromTemplate: (unitTemplate, manufactory) =>
  {
    return Unit.fromTemplate(
    {
      template: unitTemplate,
      race: manufactory.star.localRace,
      // TODO 2019.11.15 | do something else with these?
      attributeMultiplier: 1,
      healthMultiplier: 1,
    });
  },
  afterBuilt: (builtUnits, manufactory) =>
  {
    const fleets = Fleet.createFleetsFromUnits(builtUnits, manufactory.owner);
    fleets.forEach(fleet =>
    {
      manufactory.owner.addFleet(fleet);
      manufactory.star.addFleet(fleet);
    });

    builtUnits.forEach(builtUnit =>
    {
      manufactory.owner.addUnit(builtUnit);
      builtUnit.mapLevelModifiers.handleConstruct();
    });
  },
  serialize: (template) => template.key,
  deserialize: (templateType) => activeModuleData.templates.units.get(templateType),
};

export const coreManufacturableThingKinds =
{
  item: item,
  unit: unit,
};
