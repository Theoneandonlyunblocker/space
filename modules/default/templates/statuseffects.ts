/// <reference path="../../../src/templateinterfaces/istatuseffectattributeadjustment.d.ts"/>
/// <reference path="../../../src/templateinterfaces/istatuseffectattributes.d.ts"/>
/// <reference path="../../../src/templateinterfaces/istatuseffecttemplate.d.ts"/>
module Rance
{
  export module Modules
  {
    export module DefaultModule
    {
      export module Templates
      {
        export module StatusEffects
        {
          export var test: Rance.Templates.IStatusEffectTemplate =
          {
            type: "test",
            displayName: "test",
            attributes:
            {
              attack:
              {
                flat: 9
              },
              defence:
              {
                flat: 9
              },
              intelligence:
              {
                flat: -9
              },
              speed:
              {
                flat: 9
              }
            },
            passiveSkills: [PassiveSkills.poisoned]
          }
        }
      }
    }
  }
}
