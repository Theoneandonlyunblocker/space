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
    layers:
    {
      unitSprite: PIXI.Container;
      unitOverlay: PIXI.Container;
    };

    activeUnit: Unit;
    pendingUnit: Unit;
    
    unitState: BattleSceneUnitState;
    onStateChange: () => void;
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
      this.layers =
      {
        unitSprite: new PIXI.Container,
        unitOverlay: new PIXI.Container
      }

      this.container.addChild(this.layers.unitSprite);
      this.container.addChild(this.layers.unitOverlay);
    }

    // enter without animation
    enterUnitSpriteWithoutAnimation(unit: Unit)
    {
      this.setUnit(unit);
      this.setUnitSprite(unit);
    }

    // exit without animation
    exitUnitSpriteWithoutAnimation(unit: Unit)
    {
      this.clearUnit();
      this.clearUnitSprite();
    }

    // enter with animation
    enterUnitSprite(unit: Unit)
    {
      console.log("enter");
      if (this.unitState === BattleSceneUnitState.stationary)
      {
        // trigger exit
        // on exit finish:
        //    trigger enter
        this.exitUnitSprite(unit);
        this.onStateChange = this.startUnitSpriteEnter.bind(this, unit);
      }
      else if (this.unitState === BattleSceneUnitState.exiting)
      {
        // wait for exit
        // on exit finish:
        //    trigger enter
        this.onStateChange = this.startUnitSpriteEnter.bind(this, unit);
      }
      else
      {
        // clear
        // trigger enter
        this.clearUnit();
        this.clearUnitSprite();
        this.startUnitSpriteEnter(unit);
      }
    }
    // exit with animation
    exitUnitSprite(unit: Unit)
    {
      if (this.unitState !== BattleSceneUnitState.stationary)
      {
        debugger;
        throw new Error("invalid unit animation state");
      }
      this.startUnitSpriteExit(unit);
    }

    private startUnitSpriteEnter(unit: Unit)
    {
      this.setUnit(unit);
      this.setUnitSprite(unit);
      this.unitState = BattleSceneUnitState.entering;

      this.tween = this.makeEnterExitTween("enter", 200);
      this.tween.onStop = this.finishUnitSpriteEnter.bind(this);
      this.tween.start();
    }
    private finishUnitSpriteEnter()
    {
      this.unitState = BattleSceneUnitState.stationary;
      this.clearTween();
    }
    private startUnitSpriteExit(unit: Unit)
    {
      this.unitState = BattleSceneUnitState.exiting;
      
      this.tween = this.makeEnterExitTween("exit", 200);
      this.tween.onStop = this.finishUnitSpriteExit.bind(this);
      this.tween.start();
    }
    private finishUnitSpriteExit()
    {
      this.clearUnit();
      this.clearUnitSprite();

      if (this.onStateChange)
      {
        this.onStateChange();
        this.onStateChange = null;
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
    private setContainersPosition(positionOffScreen: boolean = false)
    {
      // TODO battle scene. This & unit drawing FN rely on overly fiddly positioning.
      // This function might not work properly with other drawing functions.
      var sceneBounds = this.getSceneBounds();
      var shouldReverse = this.activeUnit.battleStats.side === "side1";
      
      [this.layers.unitSprite, this.layers.unitOverlay].forEach(
        function(container: PIXI.Container)
      {
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
      });
    }
    private setUnit(unit: Unit)
    {
      this.clearUnit();
      this.activeUnit = unit;
    }
    private clearUnit()
    {
      this.activeUnit = null;
      this.onStateChange = null;
      this.clearTween();
      this.unitState = BattleSceneUnitState.removed;
    }

    private makeUnitSprite(unit: Unit, SFXParams: Templates.SFXParams)
    {
      return unit.drawBattleScene(SFXParams);
    }
    private addUnitSprite(sprite: PIXI.DisplayObject)
    {
      this.layers.unitSprite.addChild(sprite);
      this.setContainersPosition();
    }
    private clearUnitSprite()
    {
      this.layers.unitSprite.removeChildren();
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
      this.unitState = BattleSceneUnitState.stationary;
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
    private makeEnterExitTween(direction: "enter" | "exit", duration: number)
    {
      var side = this.activeUnit.battleStats.side;
      var container = this.layers.unitSprite;
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

      var tween = new TWEEN.Tween(
      {
        x: startX
      }).to(
      {
        x: finishX
      }, duration).onUpdate(function()
      {
        container.x = this.x;
      });

      console.log(container.x, bounds.x, offscreenLocation, stationaryLocation, side);
      container.x = startX;
      return tween;
    }
  }
}
