import BattleSFXTemplate from "../../../src/templateinterfaces/BattleSFXTemplate.d.ts";

import BlackToAlphaFilter from "../../../src/shaders/BlackToAlpha.ts";

import rocketAttackDrawingFunction from "../battlesfxfunctions/rocketAttack.ts";
import guardDrawingFunction from "../battlesfxfunctions/guard.ts";
import particleTestDrawingFunction from "../battlesfxfunctions/particleTest.ts";
import makeSFXFromVideo from "../battlesfxfunctions/makeSFXFromVideo.ts";


export var rocketAttack: BattleSFXTemplate =
{
  duration: 1500,
  battleOverlay: rocketAttackDrawingFunction,
  SFXWillTriggerEffect: true
}
export var guard: BattleSFXTemplate =
{
  duration: 1000,
  battleOverlay: guardDrawingFunction,
  SFXWillTriggerEffect: true
}
export var particleTest: BattleSFXTemplate =
{
  duration: 3500,
  battleOverlay: particleTestDrawingFunction,
  SFXWillTriggerEffect: true
}
export var videoTest: BattleSFXTemplate =
{
  duration: 1000,
  battleOverlay: makeSFXFromVideo.bind(null, "img/bushiAttack.webm",
    function(sprite: PIXI.Sprite)
    {
      sprite.blendMode = PIXI.BLEND_MODES.SCREEN;
      sprite.shader = new BlackToAlphaFilter();
    }),
  SFXWillTriggerEffect: false
}
