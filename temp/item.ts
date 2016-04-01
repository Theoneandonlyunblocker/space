/// <reference path="templateinterfaces/iitemtemplate.d.ts" />
/// <reference path="unit.ts" />

/// <reference path="savedata/iitemsavedata.d.ts" />

namespace Rance
{

  export class Item
  {
    id: number;
    template: Templates.IItemTemplate;
    unit: Unit;

    constructor(
      template: Templates.IItemTemplate,
      id?: number)
    {
      this.id = isFinite(id) ? id : idGenerators.item++;
      this.template = template;
    }

    serialize(): IItemSaveData
    {
      var data: IItemSaveData =
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
}
