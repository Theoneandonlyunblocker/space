/// <reference path="../../../src/templateinterfaces/iculturetemplate.d.ts"/>
module Rance
{
  export module Modules
  {
    export module DefaultModule
    {
      export module Templates
      {
        export module Cultures
        {
          export var badassCulture: Rance.Templates.ICultureTemplate =
          {
            key: "badassCulture",
            nameGenerator: function(unit: Unit)
            {
              var ownCulture = app.moduleData.Templates.Cultures["badassCulture"];
              var title = getRandomProperty(ownCulture.firstNames).displayName;
              return title + " " + unit.template.displayName;
            },
            firstNames:
            {
              cool:
              {
                key: "cool",
                displayName: "Cool"
              },
              badass:
              {
                key: "badass",
                displayName: "Badass"
              }
            }
          }
        }
      }
    }
  }
}
