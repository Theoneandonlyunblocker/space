import * as PIXI from "pixi.js";

import {Point} from "../Point";
import {Unit} from "../Unit";
import {AbilityUseEffectsById} from "../AbilityUseEffect";
import {AbilityUseEffectsForVfx} from "../AbilityUseEffectsForVfx";


export interface VfxParams<E extends AbilityUseEffectsById = {}>
{
  user: Unit;
  target?: Unit;
  userOffset: Point;
  targetOffset?: Point;
  width: number;
  height: number;
  /**
   * milliseconds
   */
  duration: number;
  // TODO 2019.08.21 | rename userIsFacingRight?
  facingRight: boolean;
  renderer: PIXI.Renderer;
  abilityUseEffects?: AbilityUseEffectsForVfx<E>;
  triggerStart: (displayObject: PIXI.DisplayObject) => void;
  triggerEnd: () => void;
}
