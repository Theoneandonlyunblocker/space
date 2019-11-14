import { ManufacturableThingKind } from "../templateinterfaces/ManufacturableThing";
import { ItemTemplate } from "../templateinterfaces/ItemTemplate";
import { Item } from "../items/Item";
import { UnitTemplate } from "../templateinterfaces/UnitTemplate";
import { Unit } from "../unit/Unit";
import { Fleet } from "../fleets/Fleet";


const item: ManufacturableThingKind<ItemTemplate, Item> =
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
  }
};
const unit: ManufacturableThingKind<UnitTemplate, Unit> =
{
  key: "unit",
  buildFromTemplate: (unitTemplate, manufactory) =>
  {
    return Unit.fromTemplate(
    {
      template: unitTemplate,
      race: manufactory.star.localRace,
      attributeMultiplier: manufactory.unitStatsModifier,
      healthMultiplier: manufactory.unitHealthModifier,
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
  }
};

export const coreManufacturableThingKinds =
{
  item: item,
  unit: unit,
};
