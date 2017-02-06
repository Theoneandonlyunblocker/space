
import Unit from "./Unit";
import idGenerators from "./idGenerators";
import ItemTemplate from "./templateinterfaces/ItemTemplate";

import ItemSaveData from "./savedata/ItemSaveData";


export default class Item
{
  id: number;
  template: ItemTemplate;
  unit: Unit;
  positionInUnit: number;

  constructor(
    template: ItemTemplate,
    id?: number,
  )
  {
    this.id = isFinite(id) ? id : idGenerators.item++;
    this.template = template;
  }

  serialize(): ItemSaveData
  {
    const data: ItemSaveData =
    {
      id: this.id,
      templateType: this.template.type,
    };

    if (this.unit)
    {
      data.positionInUnit = this.positionInUnit;
    }

    return data;
  }
}
