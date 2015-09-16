module Rance
{
  export module TemplateIndexes
  {
    export var distributablesByDistributionGroup:
    {
      [groupName: string]:
      {
        unitFamilies: Templates.IUnitFamily[];
        resources: Templates.IResourceTemplate[];
      };
    } = (function()
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
    })();
  }
}
