
import Unit from "./Unit";
import idGenerators from "./idGenerators";
import ItemTemplate from "./templateinterfaces/ItemTemplate";

import ItemSaveData from "./savedata/ItemSaveData";


export default class Item
{
  id: number;
  template: ItemTemplate;
  unit: Unit | undefined;
  positionInUnit: number | undefined;

  constructor(
    template: ItemTemplate,
    id?: number,
  )
  {
    this.id = id !== undefined ? id : idGenerators.item++;
    this.template = template;
  }

  serialize(): ItemSaveData
  {
    const data: ItemSaveData =
    {
      id: this.id,
      templateType: this.template.type,
    };

    if (this.positionInUnit)
    {
      data.positionInUnit = this.positionInUnit;
    }

    return data;
  }
}
