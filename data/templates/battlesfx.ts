/// <reference path="../../src/templateinterfaces/ibattlesfxtemplate.d.ts"/>
/// <reference path="../../src/templateinterfaces/sfxparams.d.ts"/>
/// <reference path="../../src/battlesfxfunctions/battlesfxutils.ts" />
/// <reference path="../../src/battlesfxfunctions/rocketattack.ts" />
/// <reference path="../../src/battlesfxfunctions/guard.ts" />

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
          export var rocketAttack: IBattleSFXTemplate =
          {
            duration: 1500,
            battleOverlay: BattleSFXFunctions.rocketAttack,
            delay: 0.3
          }
          export var guard: IBattleSFXTemplate =
          {
            duration: 1500,
            battleOverlay: BattleSFXFunctions.guard,
            delay: 0.3
          }
        }
      }
    }
  }
}
