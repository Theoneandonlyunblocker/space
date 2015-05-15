/// <reference path="../data/templates/itemtemplates.ts" />
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
      for (var itemName in Templates.Items)
      {
        var item = Templates.Items[itemName];

        if (!this.itemsByTechLevel[item.techLevel])
        {
          this.itemsByTechLevel[item.techLevel] = [];
        }

        this.itemsByTechLevel[item.techLevel].push(item);
      }
    }
  }
}