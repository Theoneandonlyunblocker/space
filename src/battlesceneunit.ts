/// <reference path="../lib/pixi.d.ts" />
/// <reference path="templateinterfaces/IBattleSFXTemplate.d.ts" />
/// <reference path="unit.ts" />

module Rance
{
  export enum BattleSceneUnitState
  {
    entering,
    stationary,
    exiting,
    removed
  }

  export class BattleSceneUnit
  {
    container: PIXI.Container;
    renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;

    spriteContainer: PIXI.Container;

    activeUnit: Unit;
    
    unitState: BattleSceneUnitState;
    onFinishEnter: () => void;
    onFinishExit: () => void;
    tween: TWEEN.Tween;

    getSceneBounds: () => {width: number; height: number};

    constructor(container: PIXI.Container, renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer)
    {
      this.container = container;
      this.renderer = renderer;
      this.initLayers();
    }
    destroy()
    {

    }
    private initLayers()
    {
      this.spriteContainer = new PIXI.Container;
      this.container.addChild(this.spriteContainer);
    }

    changeActiveUnit(unit: Unit)
    {
      if (!unit)
      {
        this.exitUnitSprite();
      }
      else
      {
        this.enterUnitSprite(unit);
      }
    }

    // enter without animation
    enterUnitSpriteWithoutAnimation(unit: Unit)
    {
      this.setUnit(unit);
      this.setUnitSprite(unit);

      this.finishUnitSpriteEnter();
    }

    // exit without animation
    exitUnitSpriteWithoutAnimation()
    {
      this.finishUnitSpriteExit();
    }

    // enter with animation
    enterUnitSprite(unit: Unit)
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
    exitUnitSprite()
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
        console.warn("called exitUnitSprite with unintended animation state " +
          BattleSceneUnitState[this.unitState]);
      }
    }

    private startUnitSpriteEnter(unit: Unit)
    {
      var enterAnimationDuration = Options.battleAnimationTiming.unitEnter;
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
      var exitAnimationDuration = Options.battleAnimationTiming.unitExit;
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
    }): Templates.SFXParams
    {
      var bounds = this.getSceneBounds();

      return(
      {
        user: props.unit,
        width: bounds.width,
        height: bounds.height,
        duration: props.duration,
        facingRight: props.unit.battleStats.side === "side1",
        renderer: this.renderer,
        triggerStart: props.triggerStart,
        triggerEnd: props.triggerEnd
      });
    }
    private setContainerPosition(positionOffScreen: boolean = false)
    {
      // TODO battle scene. This & unit drawing FN rely on overly fiddly positioning.
      // This function might not work properly with other drawing functions.
      var sceneBounds = this.getSceneBounds();
      var shouldReverse = this.activeUnit.battleStats.side === "side1";
      var container = this.spriteContainer;

      var containerBounds = container.getLocalBounds();
      var xPadding = 30;
      var yPadding = 40;

      container.y = Math.round(sceneBounds.height - containerBounds.height - containerBounds.y - yPadding);

      if (shouldReverse)
      {
        container.scale.x = -1;
        container.x = Math.round(containerBounds.width + containerBounds.x + xPadding);
      }
      else
      {
        container.x = Math.round(sceneBounds.width - containerBounds.width - containerBounds.x - xPadding);
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

    private makeUnitSprite(unit: Unit, SFXParams: Templates.SFXParams)
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
      var SFXParams = this.getSFXParams(
      {
        unit: unit,
        triggerStart: this.addUnitSprite.bind(this)
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
      var side = this.activeUnit.battleStats.side;
      var container = this.spriteContainer;
      var bounds = container.getBounds();

      var distanceToMove = bounds.width * 1.25;
      if (side === "side2")
      {
        distanceToMove *= -1;
      }
      var offscreenLocation = container.x - distanceToMove;
      var stationaryLocation = container.x;

      var startX = direction === "enter" ? offscreenLocation : stationaryLocation;
      var finishX = direction === "enter" ? stationaryLocation : offscreenLocation;

      container.x = startX;

      var tween = new TWEEN.Tween(
      {
        x: startX
      }).to(
      {
        x: finishX
      }, duration).onStart(function()
      {
        container.x = startX;
      }).onUpdate(function()
      {
        container.x = this.x;
      }).onComplete(onComplete);

      tween.start();
      return tween;
    }
  }
}
