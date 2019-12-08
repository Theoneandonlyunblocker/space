import { ManufacturableThingKind } from "core/src/templateinterfaces/ManufacturableThing";
import { TitanPrototype } from "./TitanPrototype";
import { Unit } from "core/src/unit/Unit";
import { Item } from "core/src/items/Item";
import { coreManufacturableThingKinds } from "core/src/production/coreManufacturableThingKinds";


export const manufacturableThingKinds =
{
  titanFromPrototype: <ManufacturableThingKind<TitanPrototype, Unit>>
  {
    key: "titanFromPrototype",
    buildFromTemplate: (prototype, manufactory) =>
    {
      const unit = Unit.fromTemplate(
      {
        template: prototype.chassis,
        race: manufactory.star.localRace,
      });

      prototype.components.forEach(componentTemplate =>
      {
        const item = new Item(componentTemplate);
        unit.items.addItem(item);
      });

      return unit;
    },
    afterBuilt: coreManufacturableThingKinds.unit.afterBuilt,
  }
};
