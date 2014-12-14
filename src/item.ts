/// <reference path="../data/templates/itemtemplates.ts" />
/// <reference path="unit.ts" />

module Rance
{
  var idGenerators = idGenerators || {};
  idGenerators.item = idGenerators.item || 0;

  export class Item
  {
    id: number;
    template: Templates.IItemTemplate;
    unit: Unit;

    constructor(template: Templates.IItemTemplate)
    {
      this.id = idGenerators.item++;
      this.template = template;
    }
  }
}
