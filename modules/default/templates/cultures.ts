/// <reference path="../../../src/templateinterfaces/iculturetemplate.d.ts"/>
namespace Rance
{
  export namespace Modules
  {
    export namespace DefaultModule
    {
      export namespace Templates
      {
        export namespace Cultures
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
