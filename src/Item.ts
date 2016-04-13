
import idGenerators from "./idGenerators"; // TODO refactor | autogenerated
import ItemTemplate from "./templateinterfaces/ItemTemplate";
import Unit from "./Unit";

import ItemSaveData from "./savedata/ItemSaveData";
/// <reference path="savedata/iitemsavedata.d.ts" />


export default class Item
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
