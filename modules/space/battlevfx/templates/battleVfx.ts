import {UnitAttribute} from "src/unit/UnitAttributes";
import {BattleVfxTemplate} from "src/templateinterfaces/BattleVfxTemplate";

import {BlackToAlphaFilter} from "../drawingfunctions/shaders/BlackToAlphaFilter";

import {beam as beamDrawingFunction} from "../drawingfunctions/beam";
import {guard as guardDrawingFunction} from "../drawingfunctions/guard";
import {makeVfxFromVideo} from "../drawingfunctions/makeVfxFromVideo";
import {rocketAttack as rocketAttackDrawingFunction} from "../drawingfunctions/rocketAttack";
import {snipe as snipeDrawingFunction} from "../drawingfunctions/snipe";
import {boardingHookBattleOverlay as boardingHookDrawingFunction, boardingHookEnemySprite} from "../drawingfunctions/boardingHook";


export const rocketAttack: BattleVfxTemplate =
{
  duration: 1500,
  battleOverlay: rocketAttackDrawingFunction,
  vfxWillTriggerEffect: true,
};
export const guard: BattleVfxTemplate =
{
  duration: 750,
  battleOverlay: guardDrawingFunction,
  vfxWillTriggerEffect: true,
};
export const beam: BattleVfxTemplate =
{
  duration: 3500,
  battleOverlay: beamDrawingFunction,
  vfxWillTriggerEffect: true,
};

function makeSnipeTemplate(attribute: UnitAttribute): BattleVfxTemplate
{
  return(
  {
    duration: 3000,
    battleOverlay: snipeDrawingFunction.bind(null, attribute),
    vfxWillTriggerEffect: true,
  });
}
export const snipeAttack = makeSnipeTemplate(UnitAttribute.Attack);
export const snipeDefence = makeSnipeTemplate(UnitAttribute.Defence);
export const snipeIntelligence = makeSnipeTemplate(UnitAttribute.Intelligence);
export const snipeSpeed = makeSnipeTemplate(UnitAttribute.Speed);

export const boardingHook: BattleVfxTemplate =
{
  duration: 2500,
  enemySprite: boardingHookEnemySprite,
  battleOverlay: boardingHookDrawingFunction,
  vfxWillTriggerEffect: true,
};
export const videoTest: BattleVfxTemplate =
{
  duration: 1000,
  battleOverlay: makeVfxFromVideo.bind(null, "img/bushiAttack.webm",
    (sprite: PIXI.Sprite) =>
    {
      sprite.blendMode = PIXI.BLEND_MODES.SCREEN;
      sprite.filters = [new BlackToAlphaFilter()];
    }),
  vfxWillTriggerEffect: false,
};
