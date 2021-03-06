import {UnitAttribute} from "core/src/unit/UnitAttributes";
import {BattleVfxTemplate} from "core/src/templateinterfaces/BattleVfxTemplate";

import {beam as beamDrawingFunction} from "../drawingfunctions/beam";
import {rocketAttack as rocketAttackDrawingFunction} from "../drawingfunctions/rocketAttack";
import {snipe as snipeDrawingFunction} from "../drawingfunctions/snipe";
import {boardingHookBattleOverlay as boardingHookDrawingFunction, boardingHookEnemySprite} from "../drawingfunctions/boardingHook";


export const rocketAttack: BattleVfxTemplate =
{
  key: "rocketAttack",
  duration: 1500,
  battleOverlay: rocketAttackDrawingFunction,
  vfxWillTriggerEffect: true,
};
export const beam: BattleVfxTemplate =
{
  key: "beam",
  duration: 3500,
  battleOverlay: beamDrawingFunction,
  vfxWillTriggerEffect: true,
};

function makeSnipeTemplate(attribute: UnitAttribute): BattleVfxTemplate
{
  return(
  {
    key: `snipe${attribute}`,
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
  key: "boardingHook",
  duration: 2500,
  enemySprite: boardingHookEnemySprite,
  battleOverlay: boardingHookDrawingFunction,
  vfxWillTriggerEffect: true,
};
