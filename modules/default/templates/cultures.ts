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
          export var defaultCulture: Rance.Templates.ICultureTemplate =
          {
            key: "defaultCulture",
            nameGenerator: function(unit: Unit)
            {
              return "Ä" + unit.id + " " + unit.template.displayName;
            }
          }
        }
      }
    }
  }
}
