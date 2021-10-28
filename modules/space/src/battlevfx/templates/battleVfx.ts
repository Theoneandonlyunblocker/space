import {UnitAttribute} from "core/src/unit/UnitAttributes";
import {BattleVfxTemplate} from "core/src/templateinterfaces/BattleVfxTemplate";

import {beam as beamDrawingFunction} from "../drawingfunctions/beam";
import {rocketAttack as rocketAttackDrawingFunction} from "../drawingfunctions/rocketAttack";
import {snipe as snipeDrawingFunction} from "../drawingfunctions/snipe";
import {boardingHookBattleOverlay as boardingHookDrawingFunction, boardingHookEnemySprite} from "../drawingfunctions/boardingHook";


export const rocketAttack: BattleVfxTemplate =
{
  duration: 1500,
  battleOverlay: rocketAttackDrawingFunction,
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

export const battleVfxTemplates =
{
  rocketAttack: rocketAttack,
  beam: beam,
  snipeAttack: snipeAttack,
  snipeDefence: snipeDefence,
  snipeIntelligence: snipeIntelligence,
  snipeSpeed: snipeSpeed,
  boardingHook: boardingHook,
};
