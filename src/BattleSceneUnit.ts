/// <reference path="../lib/pixi.d.ts" />
/// <reference path="../lib/tween.js.d.ts" />

import BattleSfxTemplate from "./templateinterfaces/BattleSfxTemplate";
import SfxParams from "./templateinterfaces/SfxParams";

import Options from "./Options";
import Unit from "./Unit";
import UnitBattleSide from "./UnitBattleSide";
import * as debug from "./debug";


const enum BattleSceneUnitState
{
  Entering,
  Stationary,
  Exiting,
  Removed,
}

export default class BattleSceneUnit
{
  public spriteContainer: PIXI.Container;
  public getSceneBounds: () => {width: number; height: number};

  private container: PIXI.Container;
  private renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;

  private side: UnitBattleSide;
  private activeUnit: Unit | null;

  private unitState: BattleSceneUnitState = BattleSceneUnitState.Removed;
  private onFinishEnter?: () => void;
  private onFinishExit?: () => void;
  private tween: TWEEN.Tween | null;
  private hasSfxSprite: boolean = false;


  constructor(container: PIXI.Container, renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer, side: UnitBattleSide)
  {
    this.container = container;
    this.renderer = renderer;
    this.side = side;

    this.spriteContainer = new PIXI.Container();
    this.container.addChild(this.spriteContainer);
  }

  public setActiveUnit(unit: Unit | null, afterChangedCallback?: () => void)
  {
    debug.log("graphics", "setActiveUnit", this.side, unit ? unit.id : unit);

    if (this.hasSfxSprite)
    {
      if (unit)
      {
        this.enterUnitSpriteWithoutAnimation(unit);
      }
      else
      {
        this.exitUnitSpriteWithoutAnimation();
      }

      this.hasSfxSprite = false;
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
  public setSfx(sfxTemplate: BattleSfxTemplate, user: Unit, target: Unit)
  {
    if (this.activeUnit)
    {
      const duration = sfxTemplate.duration * Options.battleAnimationTiming.effectDuration;
      if (this.activeUnit === user && sfxTemplate.userSprite)
      {
        this.setSfxSprite(sfxTemplate.userSprite, duration);
      }
      else if (this.activeUnit === target && sfxTemplate.enemySprite)
      {
        this.setSfxSprite(sfxTemplate.enemySprite, duration);
      }
      else
      {

      }
    }
    else
    {

    }
  }
  public resize()
  {
    if (this.spriteContainer.children.length > 0)
    {
      this.setContainerPosition();
    }
  }

  private enterUnitSpriteWithoutAnimation(unit: Unit)
  {
    this.setUnit(unit);
    this.setUnitSprite(unit);

    this.finishUnitSpriteEnter();
  }
  private exitUnitSpriteWithoutAnimation()
  {
    this.finishUnitSpriteExit();
  }
  private enterUnitSprite(unit: Unit)
  {
    if (this.unitState === BattleSceneUnitState.Stationary)
    {
      // trigger exit
      // on exit finish:
      //    trigger enter
      this.onFinishExit = this.startUnitSpriteEnter.bind(this, unit);
      this.exitUnitSprite();
    }
    else if (this.unitState === BattleSceneUnitState.Exiting)
    {
      // on exit finish:
      //    trigger enter
      this.onFinishExit = this.startUnitSpriteEnter.bind(this, unit);
    }
    else
    {
      // clear
      // trigger enter
      this.clearUnit();
      this.clearUnitSprite();
      this.startUnitSpriteEnter(unit);
    }
    // this.clearUnit();
    // this.clearUnitSprite();
    // this.startUnitSpriteEnter(unit);
  }
  private exitUnitSprite()
  {
    if (this.unitState === BattleSceneUnitState.Entering)
    {
      this.finishUnitSpriteExit();
    }
    else if (this.unitState === BattleSceneUnitState.Stationary)
    {
      this.startUnitSpriteExit();
    }
    else if (this.unitState === BattleSceneUnitState.Exiting)
    {
      this.onFinishExit = undefined;
    }
    else
    {
      console.warn(`called exitUnitSprite with unintended animation state ${this.unitState}`);
    }
  }
  private startUnitSpriteEnter(unit: Unit)
  {
    debug.log("graphics", "startUnitSpriteEnter", this.side, unit.id);

    const enterAnimationDuration = Options.battleAnimationTiming.unitEnter;
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
  private finishUnitSpriteEnter()
  {
    debug.log("graphics", this.side, this.activeUnit ? this.activeUnit.id : null, "finishUnitSpriteEnter");

    this.unitState = BattleSceneUnitState.Stationary;
    this.clearTween();

    if (this.onFinishEnter)
    {
      debug.log("graphics", this.side, this.activeUnit ? this.activeUnit.id : null, "onFinishEnter");

      this.onFinishEnter();
      this.onFinishEnter = undefined;
    }
  }
  private startUnitSpriteExit()
  {
    debug.log("graphics", this.side, this.activeUnit ? this.activeUnit.id : null, "startUnitSpriteExit");

    const exitAnimationDuration = Options.battleAnimationTiming.unitExit;
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
  private finishUnitSpriteExit()
  {
    debug.log("graphics", this.side, this.activeUnit ? this.activeUnit.id : null, "finishUnitSpriteExit");

    this.clearUnit();
    this.clearUnitSprite();

    if (this.onFinishExit)
    {
      this.onFinishExit();
      this.onFinishExit = undefined;
    }
  }

  private getSfxParams(props:
  {
    unit: Unit;
    duration?: number;
    triggerStart: (container: PIXI.DisplayObject) => void;
    triggerEnd?: () => void;
  }): SfxParams
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
  private setContainerPosition()
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
  private setUnit(unit: Unit)
  {
    this.clearUnit();
    this.activeUnit = unit;
  }
  private clearUnit()
  {
    this.unitState = BattleSceneUnitState.Removed;
    this.activeUnit = null;
    this.clearTween();
  }

  private makeUnitSprite(unit: Unit, sfxParams: SfxParams)
  {
    return unit.drawBattleScene(sfxParams);
  }
  private addUnitSprite(sprite: PIXI.DisplayObject)
  {
    this.spriteContainer.addChild(sprite);
    this.setContainerPosition();
  }
  private clearUnitSprite()
  {
    this.spriteContainer.removeChildren();
  }
  private setUnitSprite(unit: Unit)
  {
    this.clearUnitSprite();
    const sfxParams = this.getSfxParams(
    {
      unit: unit,
      triggerStart: this.addUnitSprite.bind(this),
    });

    this.makeUnitSprite(unit, sfxParams);
  }

  private clearTween()
  {
    if (this.tween)
    {
      debug.log("graphics", this.side, this.activeUnit ? this.activeUnit.id : null, "clearTween");

      this.tween.stop();
      TWEEN.remove(this.tween);
      this.tween = null;
    }
  }
  private makeEnterExitTween(direction: "enter" | "exit", duration: number, onComplete: () => void)
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
  private setSfxSprite(spriteDrawingFN: (props: SfxParams) => void, duration: number)
  {
    this.clearUnitSprite();
    const sfxParams = this.getSfxParams(
    {
      unit: this.activeUnit,
      duration: duration,
      triggerStart: this.addUnitSprite.bind(this),
    });

    this.hasSfxSprite = true;
    spriteDrawingFN(sfxParams);
  }
}
