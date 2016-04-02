import ItemTemplate from "./templateinterfaces/ItemTemplate.d.ts";
import Unit from "./Unit.ts";

import ItemSaveData from "./savedata/ItemSaveData.d.ts";
/// <reference path="savedata/iitemsavedata.d.ts" />


export class Item
{
  id: number;
  template: ItemTemplate;
  unit: Unit;

  constructor(
    template: ItemTemplate,
    id?: number)
  {
    this.id = isFinite(id) ? id : idGenerators.item++;
    this.template = template;
  }

  serialize(): ItemSaveData
  {
    var data: ItemSaveData =
    {
      id: this.id,
      templateType: this.template.type
    };

    if (this.unit)
    {
      data.unitId = this.unit.id;
    }

    return data;
  }
}
