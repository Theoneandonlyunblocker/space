/// <reference path="../../../src/templateinterfaces/ibattlesfxtemplate.d.ts"/>
/// <reference path="../../../src/templateinterfaces/sfxparams.d.ts"/>
/// <reference path="../graphics/rocketattack.ts" />
/// <reference path="../graphics/guard.ts" />
/// <reference path="../graphics/particletest.ts" />

// TODO refactor | move shaders
export var rocketAttack: BattleSFXTemplate =
{
  duration: 1500,
  battleOverlay: BattleSFXFunctions.rocketAttack,
  SFXWillTriggerEffect: true
}
export var guard: BattleSFXTemplate =
{
  duration: 1000,
  battleOverlay: BattleSFXFunctions.guard,
  SFXWillTriggerEffect: true
}
export var particleTest: BattleSFXTemplate =
{
  duration: 3500,
  battleOverlay: BattleSFXFunctions.particleTest,
  SFXWillTriggerEffect: true
}
export var videoTest: BattleSFXTemplate =
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
