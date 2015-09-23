module Rance
{
  export function buildTemplateIndexes()
  {
    TemplateIndexes.distributablesByDistributionGroup = getDistributablesByDistributionGroup();
    TemplateIndexes.itemsByTechLevel = getItemsByTechLevel();
  }
  function getDistributablesByDistributionGroup()
  {
    var result:
    {
      [groupName: string]:
      {
        unitFamilies: Templates.IUnitFamily[];
        resources: Templates.IResourceTemplate[];
      };
    } = {};

    function putInGroups(distributables: any, distributableType: string)
    {
      for (var prop in distributables)
      {
        var distributable = distributables[prop];
        for (var i = 0; i < distributable.distributionGroups.length; i++)
        {
          var groupName = distributable.distributionGroups[i];
          if (!result[groupName])
          {
            result[groupName] =
            {
              unitFamilies: [],
              resources: []
            }
          }

          result[groupName][distributableType].push(distributable);
        }
      }
    }

    putInGroups(app.moduleData.Templates.UnitFamilies, "unitFamilies");
    putInGroups(app.moduleData.Templates.Resources, "resources");

    return result;
  }
  function getItemsByTechLevel()
  {
    var itemsByTechLevel:
    {
      [techLevel: number]: Templates.IItemTemplate[];
    } = {};
    for (var itemName in app.moduleData.Templates.Items)
    {
      var item = app.moduleData.Templates.Items[itemName];

      if (!itemsByTechLevel[item.techLevel])
      {
        itemsByTechLevel[item.techLevel] = [];
      }

      itemsByTechLevel[item.techLevel].push(item);
    }

    return itemsByTechLevel;
  }
  export module TemplateIndexes
  {
    export var distributablesByDistributionGroup:
    {
      [groupName: string]:
      {
        unitFamilies: Templates.IUnitFamily[];
        resources: Templates.IResourceTemplate[];
      };
    }
    export var itemsByTechLevel:
    {
      [techLevel: number]: Templates.IItemTemplate[];
    }
  }
}
