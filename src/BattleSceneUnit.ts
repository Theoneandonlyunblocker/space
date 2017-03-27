/// <reference path="../lib/pixi.d.ts" />
/// <reference path="../lib/tween.js.d.ts" />

import BattleSFXTemplate from "./templateinterfaces/BattleSFXTemplate";
import SFXParams from "./templateinterfaces/SFXParams";

import Options from "./Options";
import Unit from "./Unit";

const enum BattleSceneUnitState
{
  entering,
  stationary,
  exiting,
  removed,
}

export default class BattleSceneUnit
{
  public spriteContainer: PIXI.Container;
  public getSceneBounds: () => {width: number; height: number};

  private container: PIXI.Container;
  private renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;

  private activeUnit: Unit;

  private unitState: BattleSceneUnitState = BattleSceneUnitState.removed;
  private onFinishEnter: () => void;
  private onFinishExit: () => void;
  private tween: TWEEN.Tween;
  private hasSFXSprite: boolean = false;


  constructor(container: PIXI.Container, renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer)
  {
    this.container = container;
    this.renderer = renderer;

    this.spriteContainer = new PIXI.Container();
    this.container.addChild(this.spriteContainer);
  }

  public changeActiveUnit(unit: Unit, afterChangedCallback?: () => void)
  {
    if (this.hasSFXSprite)
    {
      if (unit)
      {
        this.enterUnitSpriteWithoutAnimation(unit);
      }
      else
      {
        this.exitUnitSpriteWithoutAnimation();
      }

      this.hasSFXSprite = false;
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
  public setSFX(SFXTemplate: BattleSFXTemplate, user: Unit, target: Unit)
  {
    if (this.activeUnit)
    {
      const duration = SFXTemplate.duration * Options.battleAnimationTiming.effectDuration;
      if (this.activeUnit === user && SFXTemplate.userSprite)
      {
        this.setSFXSprite(SFXTemplate.userSprite, duration);
      }
      else if (this.activeUnit === target && SFXTemplate.enemySprite)
      {
        this.setSFXSprite(SFXTemplate.enemySprite, duration);
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

  // enter without animation
  private enterUnitSpriteWithoutAnimation(unit: Unit)
  {
    this.setUnit(unit);
    this.setUnitSprite(unit);

    this.finishUnitSpriteEnter();
  }

  // exit without animation
  private exitUnitSpriteWithoutAnimation()
  {
    this.finishUnitSpriteExit();
  }

  // enter with animation
  private enterUnitSprite(unit: Unit)
  {
    if (this.unitState === BattleSceneUnitState.stationary)
    {
      // trigger exit
      // on exit finish:
      //    trigger enter
      this.onFinishExit = this.startUnitSpriteEnter.bind(this, unit);
      this.exitUnitSprite();
    }
    else if (this.unitState === BattleSceneUnitState.exiting)
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
  // exit with animation
  private exitUnitSprite()
  {
    if (this.unitState === BattleSceneUnitState.entering)
    {
      this.finishUnitSpriteExit();
    }
    else if (this.unitState === BattleSceneUnitState.stationary)
    {
      this.startUnitSpriteExit();
    }
    else if (this.unitState === BattleSceneUnitState.exiting)
    {
      this.onFinishExit = null;
    }
    else
    {
      console.warn("called exitUnitSprite with unintended animation state " + this.unitState);
    }
  }

  private startUnitSpriteEnter(unit: Unit)
  {
    const enterAnimationDuration = Options.battleAnimationTiming.unitEnter;
    if (enterAnimationDuration <= 0)
    {
      this.enterUnitSpriteWithoutAnimation(unit);

      return;
    }

    this.setUnit(unit);
    this.setUnitSprite(unit);
    this.unitState = BattleSceneUnitState.entering;

    this.tween = this.makeEnterExitTween("enter", enterAnimationDuration,
      this.finishUnitSpriteEnter.bind(this));
    this.tween.start();
  }
  private finishUnitSpriteEnter()
  {
    this.unitState = BattleSceneUnitState.stationary;
    this.clearTween();

    if (this.onFinishEnter)
    {
      this.onFinishEnter();
      this.onFinishEnter = null;
    }
  }
  private startUnitSpriteExit()
  {
    const exitAnimationDuration = Options.battleAnimationTiming.unitExit;
    if (exitAnimationDuration <= 0)
    {
      this.exitUnitSpriteWithoutAnimation();

      return;
    }

    this.unitState = BattleSceneUnitState.exiting;

    this.tween = this.makeEnterExitTween("exit", exitAnimationDuration,
      this.finishUnitSpriteExit.bind(this));
    this.tween.start();
  }
  private finishUnitSpriteExit()
  {
    this.clearUnit();
    this.clearUnitSprite();

    if (this.onFinishExit)
    {
      this.onFinishExit();
      this.onFinishExit = null;
    }
  }

  private getSFXParams(props:
  {
    unit: Unit;
    duration?: number;
    triggerStart: (container: PIXI.DisplayObject) => void;
    triggerEnd?: () => void;
  }): SFXParams
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
      triggerEnd: props.triggerEnd,
    });
  }
  private setContainerPosition()
  {
    // TODO battle scene | This & unit drawing FN rely on overly fiddly positioning.
    // This function might not work properly with other drawing functions.
    const sceneBounds = this.getSceneBounds();
    const shouldReverse = this.activeUnit.battleStats.side === "side2";

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
    this.unitState = BattleSceneUnitState.removed;
    this.activeUnit = null;
    this.clearTween();
  }

  private makeUnitSprite(unit: Unit, SFXParams: SFXParams)
  {
    return unit.drawBattleScene(SFXParams);
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
    const SFXParams = this.getSFXParams(
    {
      unit: unit,
      triggerStart: this.addUnitSprite.bind(this),
    });

    this.makeUnitSprite(unit, SFXParams);
  }

  private clearTween()
  {
    if (this.tween)
    {
      this.tween.stop();
      TWEEN.remove(this.tween);
      this.tween = null;
    }
  }
  private makeEnterExitTween(direction: "enter" | "exit", duration: number, onComplete: () => void)
  {
    const side = this.activeUnit.battleStats.side;
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
  private setSFXSprite(spriteDrawingFN: (props: SFXParams) => void, duration: number)
  {
    this.clearUnitSprite();
    const SFXParams = this.getSFXParams(
    {
      unit: this.activeUnit,
      duration: duration,
      triggerStart: this.addUnitSprite.bind(this),
    });

    this.hasSFXSprite = true;
    spriteDrawingFN(SFXParams);
  }
}
