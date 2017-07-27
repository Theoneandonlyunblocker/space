import {UnitAttribute} from "../../../src/UnitAttributes";
import BattleSFXTemplate from "../../../src/templateinterfaces/BattleSFXTemplate";

import BlackToAlphaFilter from "../battlesfxfunctions/shaders/BlackToAlpha";

import beamDrawingFunction from "../battlesfxfunctions/beam";
import guardDrawingFunction from "../battlesfxfunctions/guard";
import makeSFXFromVideo from "../battlesfxfunctions/makeSFXFromVideo";
import {placeholder as placeholderFunction} from "../battlesfxfunctions/placeholder";
import rocketAttackDrawingFunction from "../battlesfxfunctions/rocketAttack";
import snipeDrawingFunction from "../battlesfxfunctions/snipe";

import
{
  attachShaderToSprite,
} from "../../../src/pixiWrapperFunctions";


export const rocketAttack: BattleSFXTemplate =
{
  duration: 1500,
  battleOverlay: rocketAttackDrawingFunction,
  SFXWillTriggerEffect: true,
};
export const guard: BattleSFXTemplate =
{
  duration: 750,
  battleOverlay: guardDrawingFunction,
  SFXWillTriggerEffect: true,
};
export const beam: BattleSFXTemplate =
{
  duration: 3500,
  battleOverlay: beamDrawingFunction,
  SFXWillTriggerEffect: true,
};

function makeSnipeTemplate(attribute: UnitAttribute): BattleSFXTemplate
{
  return(
  {
    duration: 3000,
    battleOverlay: snipeDrawingFunction.bind(null, attribute),
    SFXWillTriggerEffect: true,
  });
}
export const snipeAttack = makeSnipeTemplate(UnitAttribute.Attack);
export const snipeDefence = makeSnipeTemplate(UnitAttribute.Defence);
export const snipeIntelligence = makeSnipeTemplate(UnitAttribute.Intelligence);
export const snipeSpeed = makeSnipeTemplate(UnitAttribute.Speed);

export const videoTest: BattleSFXTemplate =
{
  duration: 1000,
  battleOverlay: makeSFXFromVideo.bind(null, "img/bushiAttack.webm",
    function(sprite: PIXI.Sprite)
    {
      sprite.blendMode = PIXI.BLEND_MODES.SCREEN;
      attachShaderToSprite(sprite, new BlackToAlphaFilter());
    }),
  SFXWillTriggerEffect: false,
};

export const placeholder: BattleSFXTemplate =
{
  duration: 1000,
  battleOverlay: placeholderFunction,
  SFXWillTriggerEffect: false,
};
