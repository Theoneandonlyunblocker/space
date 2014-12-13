/// <reference path="../data/templates/itemtemplates.ts" />

module Rance
{
  export class Item
  {
    template: Templates.IItemTemplate;

    constructor(template: Templates.IItemTemplate)
    {
      this.template = template;
    }
  }
}
