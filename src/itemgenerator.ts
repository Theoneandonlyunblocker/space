/// <reference path="../modules/default/templates/items.ts" />
/// <reference path="item.ts" />
/// <reference path="utility.ts" />

module Rance
{
  export class ItemGenerator
  {
    itemsByTechLevel:
    {
      [techLevel: number]: Templates.IItemTemplate[];
    } = {};
    
    constructor()
    {
      this.indexItemsByTechLevel();
    }

    indexItemsByTechLevel()
    {
      for (var itemName in app.moduleData.Templates.Items)
      {
        var item = app.moduleData.Templates.Items[itemName];

        if (!this.itemsByTechLevel[item.techLevel])
        {
          this.itemsByTechLevel[item.techLevel] = [];
        }

        this.itemsByTechLevel[item.techLevel].push(item);
      }
    }
  }
}