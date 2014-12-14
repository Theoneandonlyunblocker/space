/// <reference path="../data/templates/itemtemplates.ts" />
/// <reference path="unit.ts" />

module Rance
{
  export class Item
  {
    template: Templates.IItemTemplate;
    unit: Unit;

    constructor(template: Templates.IItemTemplate)
    {
      this.template = template;
    }
  }
}
