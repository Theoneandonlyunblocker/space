import BattleSFXTemplate from "../../../src/templateinterfaces/BattleSFXTemplate";

import BlackToAlphaFilter from "../battlesfxfunctions/shaders/BlackToAlpha";

import rocketAttackDrawingFunction from "../battlesfxfunctions/rocketAttack";
import guardDrawingFunction from "../battlesfxfunctions/guard";
import beamDrawingFunction from "../battlesfxfunctions/beam";
import makeSFXFromVideo from "../battlesfxfunctions/makeSFXFromVideo";


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
export var beam: BattleSFXTemplate =
{
  duration: 3500,
  battleOverlay: beamDrawingFunction,
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
