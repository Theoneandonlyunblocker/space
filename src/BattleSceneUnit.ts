import * as TWEEN from "@tweenjs/tween.js";
import * as PIXI from "pixi.js";

import {BattleVfxTemplate} from "./templateinterfaces/BattleVfxTemplate";
import {VfxParams} from "./templateinterfaces/VfxParams";

import {options} from "./Options";
import {Unit} from "./Unit";
import {UnitBattleSide} from "./UnitBattleSide";
import * as debug from "./debug";


const enum BattleSceneUnitState
{
  Entering,
  Stationary,
  Exiting,
  Removed,
}

export class BattleSceneUnit
{
  public spriteContainer: PIXI.Container;
  public getSceneBounds: () => {width: number; height: number};

  private container: PIXI.Container;
  private renderer: PIXI.Renderer;

  private side: UnitBattleSide;
  private activeUnit: Unit | null;

  private unitState: BattleSceneUnitState = BattleSceneUnitState.Removed;
  private onFinishEnter?: () => void;
  private onFinishExit?: () => void;
  private tween: TWEEN.Tween | null;
  private hasVfxSprite: boolean = false;


  constructor(container: PIXI.Container, renderer: PIXI.Renderer, side: UnitBattleSide)
  {
    this.container = container;
    this.renderer = renderer;
    this.side = side;

    this.spriteContainer = new PIXI.Container();
    this.container.addChild(this.spriteContainer);
  }

  public setActiveUnit(unit: Unit | null, afterChangedCallback?: () => void): void
  {
    debug.log("graphics", "setActiveUnit", this.side, unit ? unit.id : unit);

    if (this.hasVfxSprite)
    {
      if (unit)
      {
        this.onFinishEnter = afterChangedCallback;
        this.enterUnitSpriteWithoutAnimation(unit);
      }
      else
      {
        this.onFinishExit = afterChangedCallback;
        this.exitUnitSpriteWithoutAnimation();
      }

      this.hasVfxSprite = false;
    }
    else if (!unit && this.activeUnit)
    {
      this.onFinishExit = afterChangedCallback;
      this.exitUnitSprite();
    }
    else if (unit && unit !== this.activeUnit)
    {
      this.onFinishEnter = afterChangedCallback;
      this.enterUnitSprite(unit);
    }
    else if (afterChangedCallback)
    {
      afterChangedCallback();
    }
  }
  public setVfx(vfxTemplate: BattleVfxTemplate, user: Unit, target: Unit): void
  {
    if (this.activeUnit)
    {
      const duration = vfxTemplate.duration * options.battle.animationTiming.effectDuration;
      if (this.activeUnit === user && vfxTemplate.userSprite)
      {
        this.setVfxSprite(vfxTemplate.userSprite, duration);
      }
      else if (this.activeUnit === target && vfxTemplate.enemySprite)
      {
        this.setVfxSprite(vfxTemplate.enemySprite, duration);
      }
      else
      {

      }
    }
    else
    {

    }
  }
  public resize(): void
  {
    if (this.spriteContainer.children.length > 0)
    {
      this.setContainerPosition();
    }
  }

  private enterUnitSpriteWithoutAnimation(unit: Unit): void
  {
    debug.log("graphics", "enterUnitSpriteWithoutAnimation", this.side, unit ? unit.id : unit);
    this.setUnit(unit);
    this.setUnitSprite(unit);

    this.finishUnitSpriteEnter();
  }
  private exitUnitSpriteWithoutAnimation(): void
  {
    debug.log("graphics", "exitUnitSpriteWithoutAnimation", this.side);
    this.finishUnitSpriteExit();
  }
  private enterUnitSprite(unit: Unit): void
  {
    if (this.unitState === BattleSceneUnitState.Stationary)
    {
      this.onFinishExit = this.startUnitSpriteEnter.bind(this, unit);
      this.exitUnitSprite();
    }
    else if (this.unitState === BattleSceneUnitState.Exiting)
    {
      this.onFinishExit = this.startUnitSpriteEnter.bind(this, unit);
    }
    else
    {
      this.clearUnit();
      this.clearUnitSprite();
      this.startUnitSpriteEnter(unit);
    }
  }
  private exitUnitSprite(): void
  {
    switch (this.unitState)
    {
      case BattleSceneUnitState.Entering:
      {
        this.finishUnitSpriteExit();
        break;
      }
      case BattleSceneUnitState.Stationary:
      {
        this.startUnitSpriteExit();
        break;
      }
      case BattleSceneUnitState.Exiting:
      {
        this.onFinishExit = undefined;
        break;
      }
      default:
      {
        console.warn(`called exitUnitSprite with unintended animation state ${this.unitState}`);
      }
    }
  }
  private startUnitSpriteEnter(unit: Unit): void
  {
    debug.log("graphics", "startUnitSpriteEnter", this.side, unit.id);

    const enterAnimationDuration = options.battle.animationTiming.unitEnter;
    if (enterAnimationDuration <= 0)
    {
      this.enterUnitSpriteWithoutAnimation(unit);

      return;
    }

    this.setUnit(unit);
    this.setUnitSprite(unit);
    this.unitState = BattleSceneUnitState.Entering;

    this.tween = this.makeEnterExitTween("enter", enterAnimationDuration,
      this.finishUnitSpriteEnter.bind(this));
    this.tween.start();
  }
  private finishUnitSpriteEnter(): void
  {
    debug.log("graphics", "finishUnitSpriteEnter", this.side, this.activeUnit ? this.activeUnit.id : null);

    this.unitState = BattleSceneUnitState.Stationary;
    this.clearTween();

    if (this.onFinishEnter)
    {
      debug.log("graphics", "onFinishEnter", this.side, this.activeUnit ? this.activeUnit.id : null);

      this.onFinishEnter();
      this.onFinishEnter = undefined;
    }
  }
  private startUnitSpriteExit(): void
  {
    debug.log("graphics", "startUnitSpriteExit", this.side, this.activeUnit ? this.activeUnit.id : null);

    const exitAnimationDuration = options.battle.animationTiming.unitExit;
    if (exitAnimationDuration <= 0)
    {
      this.exitUnitSpriteWithoutAnimation();

      return;
    }

    this.unitState = BattleSceneUnitState.Exiting;

    this.tween = this.makeEnterExitTween("exit", exitAnimationDuration,
      this.finishUnitSpriteExit.bind(this));
    this.tween.start();
  }
  private finishUnitSpriteExit(): void
  {
    debug.log("graphics", "finishUnitSpriteExit", this.side, this.activeUnit ? this.activeUnit.id : null);

    this.clearUnit();
    this.clearUnitSprite();

    if (this.onFinishExit)
    {
      this.onFinishExit();
      this.onFinishExit = undefined;
    }
  }

  private getVfxParams(props:
  {
    unit: Unit;
    duration?: number;
    triggerStart: (container: PIXI.DisplayObject) => void;
    triggerEnd?: () => void;
  }): VfxParams
  {
    const bounds = this.getSceneBounds();

    return(
    {
      user: props.unit,
      userOffset: {x: 0, y: 0},
      width: bounds.width,
      height: bounds.height,
      duration: props.duration,
      facingRight: props.unit.battleStats.side === "side1",
      renderer: this.renderer,
      triggerStart: props.triggerStart,
      triggerEffect: () => {},
      triggerEnd: props.triggerEnd || (() => {}),
    });
  }
  private setContainerPosition(): void
  {
    // TODO battle scene | This & unit drawing FN rely on overly fiddly positioning.
    // This function might not work properly with other drawing functions.
    const sceneBounds = this.getSceneBounds();
    const shouldReverse = this.side === "side2";

    const containerBounds = this.spriteContainer.getLocalBounds();
    const xPadding = 25;
    const yPadding = 40;

    this.spriteContainer.y = Math.round(sceneBounds.height - containerBounds.height - containerBounds.y - yPadding);

    if (shouldReverse)
    {
      this.spriteContainer.scale.x = -1;
      this.spriteContainer.x = Math.round(sceneBounds.width - xPadding);
    }
    else
    {
      this.spriteContainer.x = Math.round(xPadding);
    }
  }
  private setUnit(unit: Unit): void
  {
    this.clearUnit();
    this.activeUnit = unit;
  }
  private clearUnit(): void
  {
    this.unitState = BattleSceneUnitState.Removed;
    this.activeUnit = null;
    this.clearTween();
  }

  private makeUnitSprite(unit: Unit, vfxParams: VfxParams): void
  {
    return unit.drawBattleScene(vfxParams);
  }
  private addUnitSprite(sprite: PIXI.DisplayObject): void
  {
    this.spriteContainer.addChild(sprite);
    this.setContainerPosition();
  }
  private clearUnitSprite(): void
  {
    this.spriteContainer.removeChildren();
  }
  private setUnitSprite(unit: Unit): void
  {
    this.clearUnitSprite();
    const vfxParams = this.getVfxParams(
    {
      unit: unit,
      triggerStart: this.addUnitSprite.bind(this),
    });

    this.makeUnitSprite(unit, vfxParams);
  }

  private clearTween(): void
  {
    if (this.tween)
    {
      debug.log("graphics", "clearTween", this.side, this.activeUnit ? this.activeUnit.id : null);

      this.tween.stop();
      TWEEN.remove(this.tween);
      this.tween = null;
    }
  }
  private makeEnterExitTween(direction: "enter" | "exit", duration: number, onComplete: () => void): TWEEN.Tween
  {
    const side = this.activeUnit!.battleStats.side;
    const container = this.spriteContainer;
    const bounds = container.getBounds();

    let distanceToMove = bounds.width * 1.25;
    if (side === "side2")
    {
      distanceToMove *= -1;
    }
    const offscreenLocation = container.x - distanceToMove;
    const stationaryLocation = container.x;

    const startX = direction === "enter" ? offscreenLocation : stationaryLocation;
    const finishX = direction === "enter" ? stationaryLocation : offscreenLocation;

    container.x = startX;

    const tweeningObject = {x: startX};
    const tween = new TWEEN.Tween(tweeningObject).to(
    {
      x: finishX,
    }, duration).onStart(() =>
    {
      container.x = startX;
    }).onUpdate(() =>
    {
      container.x = tweeningObject.x;
    }).onComplete(onComplete);

    tween.start();

    return tween;
  }
  private setVfxSprite(spriteDrawingFN: (props: VfxParams) => void, duration: number): void
  {
    this.clearUnitSprite();
    const vfxParams = this.getVfxParams(
    {
      unit: this.activeUnit,
      duration: duration,
      triggerStart: this.addUnitSprite.bind(this),
    });

    this.hasVfxSprite = true;
    spriteDrawingFN(vfxParams);
  }
}
