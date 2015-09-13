/// <reference path="templates/units" />

module Rance
{
  export module Templates
  {
    export var unitsByFamily:
    {
      [family: number]: Templates.IUnitTemplate[];
    } = (function(unitLocations: any[]) //unitLocations: {[unitType: string]: IUnitTemplate}[]
    {
      var unitsByFamily:
      {
        [family: number]: Templates.IUnitTemplate[];
      } = {};

      for (var i = 0; i < unitLocations.length; i++)
      {
        var units = unitLocations[i];
        for (var unitType in units)
        {
          var template = units[unitType];
          for (var j = 0; j < template.families.length; j++)
          {
            var family = template.families[j];
            if (!unitsByFamily[family])
            {
              unitsByFamily[family] = [];
            }

            unitsByFamily[family].push(template);
          }
        }
      }

      return unitsByFamily;
    })([Templates.Units]);
  }
}
