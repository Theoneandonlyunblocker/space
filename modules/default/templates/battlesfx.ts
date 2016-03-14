/// <reference path="../../../src/templateinterfaces/ibattlesfxtemplate.d.ts"/>
/// <reference path="../../../src/templateinterfaces/sfxparams.d.ts"/>
/// <reference path="../graphics/rocketattack.ts" />
/// <reference path="../graphics/guard.ts" />
/// <reference path="../graphics/particletest.ts" />

module Rance
{
  export module Modules
  {
    export module DefaultModule
    {
      export module Templates
      {
        export module BattleSFX
        {
          export var rocketAttack: Rance.Templates.IBattleSFXTemplate =
          {
            duration: 1500,
            battleOverlay: BattleSFXFunctions.rocketAttack,
            SFXWillTriggerEffect: true
          }
          export var guard: Rance.Templates.IBattleSFXTemplate =
          {
            duration: 1000,
            battleOverlay: BattleSFXFunctions.guard,
            SFXWillTriggerEffect: true
          }
          export var particleTest: Rance.Templates.IBattleSFXTemplate =
          {
            duration: 5000,
            battleOverlay: BattleSFXFunctions.particleTest,
            SFXWillTriggerEffect: false
          }
        }
      }
    }
  }
}
