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
      // TODO refactor | move shaders
      export class BlackToAlphaFilter extends PIXI.AbstractFilter
      {
        constructor()
        {
          super(null, ShaderSources.blacktoalpha.join("\n"), null);
        }
      }
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
            duration: 3500,
            battleOverlay: BattleSFXFunctions.particleTest,
            SFXWillTriggerEffect: true
          }
          export var videoTest: Rance.Templates.IBattleSFXTemplate =
          {
            duration: 1000,
            battleOverlay: BattleSFXFunctions.makeSFXFromVideo.bind(null, "img/bushiAttack.webm",
              function(sprite: PIXI.Sprite)
              {
                sprite.blendMode = PIXI.BLEND_MODES.SCREEN;
                sprite.shader = new BlackToAlphaFilter();
              }),
            SFXWillTriggerEffect: true
          }
        }
      }
    }
  }
}
