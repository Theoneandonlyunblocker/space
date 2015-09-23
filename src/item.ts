/// <reference path="templateinterfaces/iitemtemplate.d.ts" />
/// <reference path="unit.ts" />

module Rance
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

    serialize()
    {
      var data: any = {};

      data.id = this.id;
      data.templateType = this.template.type;
      if (this.unit)
      {
        data.unitId = this.unit.id;
      }

      return data;
    }
  }
}
