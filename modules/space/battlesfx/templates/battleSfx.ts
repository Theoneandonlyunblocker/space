import {UnitAttribute} from "../../../../src/UnitAttributes";
import BattleSfxTemplate from "../../../../src/templateinterfaces/BattleSfxTemplate";

import BlackToAlphaFilter from "../drawingfunctions/shaders/BlackToAlpha";

import beamDrawingFunction from "../drawingfunctions/beam";
import guardDrawingFunction from "../drawingfunctions/guard";
import makeSfxFromVideo from "../drawingfunctions/makeSfxFromVideo";
import {placeholder as placeholderFunction} from "../drawingfunctions/placeholder";
import rocketAttackDrawingFunction from "../drawingfunctions/rocketAttack";
import snipeDrawingFunction from "../drawingfunctions/snipe";

import
{
  attachShaderToSprite,
} from "../../../../src/pixiWrapperFunctions";


export const rocketAttack: BattleSfxTemplate =
{
  duration: 1500,
  battleOverlay: rocketAttackDrawingFunction,
  sfxWillTriggerEffect: true,
};
export const guard: BattleSfxTemplate =
{
  duration: 750,
  battleOverlay: guardDrawingFunction,
  sfxWillTriggerEffect: true,
};
export const beam: BattleSfxTemplate =
{
  duration: 3500,
  battleOverlay: beamDrawingFunction,
  sfxWillTriggerEffect: true,
};

function makeSnipeTemplate(attribute: UnitAttribute): BattleSfxTemplate
{
  return(
  {
    duration: 3000,
    battleOverlay: snipeDrawingFunction.bind(null, attribute),
    sfxWillTriggerEffect: true,
  });
}
export const snipeAttack = makeSnipeTemplate(UnitAttribute.Attack);
export const snipeDefence = makeSnipeTemplate(UnitAttribute.Defence);
export const snipeIntelligence = makeSnipeTemplate(UnitAttribute.Intelligence);
export const snipeSpeed = makeSnipeTemplate(UnitAttribute.Speed);

export const videoTest: BattleSfxTemplate =
{
  duration: 1000,
  battleOverlay: makeSfxFromVideo.bind(null, "img/bushiAttack.webm",
    (sprite: PIXI.Sprite) =>
    {
      sprite.blendMode = PIXI.BLEND_MODES.SCREEN;
      attachShaderToSprite(sprite, new BlackToAlphaFilter());
    }),
  sfxWillTriggerEffect: false,
};

export const placeholder: BattleSfxTemplate =
{
  duration: 1000,
  battleOverlay: placeholderFunction,
  sfxWillTriggerEffect: false,
};
