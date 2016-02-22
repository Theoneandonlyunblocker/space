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
  export class BattleScene
  {
    container: PIXI.Container;
    renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
    pixiContainer: HTMLElement;

    layers:
    {
      battleOverlay: PIXI.Container;
      side1Container: PIXI.Container;
      side1UnitOverlay: PIXI.Container;
      side1Unit: PIXI.Container;
      side2Container: PIXI.Container;
      side2UnitOverlay: PIXI.Container;
      side2Unit: PIXI.Container;
    };

    side1Unit: Unit;
    side2Unit: Unit;

    side1UnitState: BattleSceneUnitState;
    onSide1UnitStateChange: () => void;
    side2UnitState: BattleSceneUnitState;
    onSide2UnitStateChange: () => void;

    side1UnitSpeedX: number = 0;
    side2UnitSpeedX: number = 0;

    activeSFX: Templates.IBattleSFXTemplate;
    userUnit: Unit;
    targetUnit: Unit;

    isPaused: boolean = false;
    forceFrame: boolean = false;

    resizeListener: (e: Event) => void;

    constructor(pixiContainer: HTMLElement)
    {
      this.pixiContainer = pixiContainer;
      this.container = new PIXI.Container();

      var pixiContainerStyle = window.getComputedStyle(this.pixiContainer);
      this.renderer = PIXI.autoDetectRenderer(
        parseInt(pixiContainerStyle.width),
        parseInt(pixiContainerStyle.height),
        {
          autoResize: false,
          antialias: true
        }
      );

      this.pixiContainer.appendChild(this.renderer.view);
      this.renderer.view.setAttribute("id", "battle-scene-pixi-canvas");
      
      this.initLayers();

      this.resizeListener = this.handleResize.bind(this);
      window.addEventListener("resize", this.resizeListener, false);
    }
    destroy()
    {
      this.container.renderable = false;
      this.pause();

      if (this.renderer)
      {
        this.renderer.destroy(true);
        this.renderer = null;
      }

      this.container.destroy(true);
      this.container = null;
      this.pixiContainer = null;

      window.removeEventListener("resize", this.resizeListener);
    }
    initLayers()
    {
      this.layers =
      {
        battleOverlay: new PIXI.Container,
        side1Container: new PIXI.Container,
        side1UnitOverlay: new PIXI.Container,
        side1Unit: new PIXI.Container,
        side2Container: new PIXI.Container,
        side2UnitOverlay: new PIXI.Container,
        side2Unit: new PIXI.Container
      };

      this.layers.side1Container.addChild(this.layers.side1Unit);
      this.layers.side1Container.addChild(this.layers.side1UnitOverlay);
      this.layers.side2Container.addChild(this.layers.side2Unit);
      this.layers.side2Container.addChild(this.layers.side2UnitOverlay);

      this.container.addChild(this.layers.side1Container);
      this.container.addChild(this.layers.side2Container);
      this.container.addChild(this.layers.battleOverlay);
    }
    handleResize()
    {
      var w = this.pixiContainer.offsetWidth * window.devicePixelRatio;
      var h = this.pixiContainer.offsetHeight * window.devicePixelRatio;
      this.renderer.resize(w, h);
    }
    getSceneBounds()
    {
      return(
      {
        width: this.renderer.width,
        height: this.renderer.height
      });
    }
    getSFXParams(props:
    {
      triggerStart: (container: PIXI.DisplayObject) => void;
      triggerEnd?: () => void;
    }): Templates.SFXParams
    {
      var bounds = this.getSceneBounds();
      var duration = this.activeSFX.duration; // TODO battle scene options timing

      return(
      {
        user: this.userUnit,
        target: this.targetUnit,
        width: bounds.width,
        height: bounds.height,
        duration: duration,
        facingRight: this.userUnit.battleStats.side === "side1",
        renderer: this.renderer,
        triggerStart: props.triggerStart,
        triggerEnd: props.triggerEnd
      });
    }

    getUnitSFXParams(props:
    {
      unit: Unit;
      duration?: number;
      triggerStart: (container: PIXI.DisplayObject) => void;
      triggerEnd?: () => void;
    }): Templates.SFXParams
    {
      var bounds = this.getSceneBounds();
      var duration = props.duration || -1;

      return(
      {
        user: props.unit,
        width: bounds.width,
        height: bounds.height,
        duration: duration,
        facingRight: props.unit.battleStats.side === "side1",
        renderer: this.renderer,
        triggerStart: props.triggerStart,
        triggerEnd: props.triggerEnd
      });
    }

    
    setActiveSFX()
    {

    }
    clearActiveSFX()
    {
      this.activeSFX = null;
      this.clearBattleOverlay();
      this.clearUnitOverlay("side1");
      this.clearUnitOverlay("side2");
    }
    makeBattleOverlay()
    {
      var SFXParams = this.getSFXParams(
      {
        triggerStart: this.addBattleOverlay,
        triggerEnd: this.clearBattleOverlay
      });
      this.activeSFX.battleOverlay(SFXParams);
    }
    addBattleOverlay(overlay: PIXI.DisplayObject)
    {
      this.clearBattleOverlay();
      this.layers.battleOverlay.addChild(overlay);
    }
    clearBattleOverlay()
    {
      this.layers.battleOverlay.removeChildren();
    }

    // UNITS
    setUnitContainersPosition()
    {
      // TODO battle scene. This & unit drawing FN rely on overly fiddly positioning.
      // This function might not work properly with other drawing functions.
      var sceneBounds = this.getSceneBounds();
      
      [this.layers.side1Unit, this.layers.side1UnitOverlay,
        this.layers.side2Unit, this.layers.side2UnitOverlay].forEach(
        function(container: PIXI.Container, i: number)
      {
        var containerBounds = container.getLocalBounds();
        var xPadding = 30;
        var yPadding = 40;

        container.y = Math.round(sceneBounds.height - containerBounds.height - containerBounds.y - yPadding);

        if (i < 2)
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
    setUnit(unit: Unit)
    {
      switch (unit.battleStats.side)
      {
        case "side1":
        {
          this.side1Unit = unit;
          break;
        }
        case "side2":
        {
          this.side2Unit = unit;
          break;
        }
      }
    }
    clearUnit(unit: Unit)
    {
      switch (unit.battleStats.side)
      {
        case "side1":
        {
          this.side1Unit = null;
          break;
        }
        case "side2":
        {
          this.side2Unit = null;
          break;
        }
      }

      this.setUnitStateChangeCallback(unit, null);
      this.setUnitState(unit, BattleSceneUnitState.removed);
    }

    setUnitState(unit: Unit, state: BattleSceneUnitState)
    {
      switch (unit.battleStats.side)
      {
        case "side1":
        {
          this.side1UnitState = state;
          break;
        }
        case "side2":
        {
          this.side1UnitState = state;
          break;
        }
      }
    }
    getUnitStateForSameSide(unit: Unit)
    {
      switch (unit.battleStats.side)
      {
        case "side1":
        {
          return this.side1UnitState;
        }
        case "side2":
        {
          return this.side2UnitState;
        }
      }
    }
    getUnitStateChangeCallback(unit: Unit)
    {
      switch (unit.battleStats.side)
      {
        case "side1":
        {
          return this.onSide1UnitStateChange;
        }
        case "side2":
        {
          return this.onSide2UnitStateChange;
        }
      }
    }
    setUnitStateChangeCallback(unit: Unit, callback: () => void)
    {
      switch (unit.battleStats.side)
      {
        case "side1":
        {
          this.onSide1UnitStateChange = callback;
          break;
        }
        case "side2":
        {
          this.onSide2UnitStateChange = callback;
          break;
        }
      }
    }

    makeUnitSprite(unit: Unit, SFXParams: Templates.SFXParams)
    {
      return unit.drawBattleScene(SFXParams);
    }
    setUnitSprite(unit: Unit)
    {
      this.clearUnitSprite(unit);
      this.setUnit(unit);
      var SFXParams = this.getUnitSFXParams(
      {
        unit: unit,
        triggerStart: this.addUnitSprite.bind(this, unit)
      });

      this.makeUnitSprite(unit, SFXParams);
      this.setUnitState(unit, BattleSceneUnitState.stationary);
    }
    addUnitSprite(unit: Unit, sprite: PIXI.DisplayObject)
    {
      switch (unit.battleStats.side)
      {
        case "side1":
        {
          this.layers.side1Unit.addChild(sprite);
          break;
        }
        case "side2":
        {
          this.layers.side2Unit.addChild(sprite);
          break;
        }
      }

      this.setUnitContainersPosition();
    }
    clearUnitSprite(unit: Unit)
    {
      this.clearUnit(unit);
      switch (unit.battleStats.side)
      {
        case "side1":
        {
          this.layers.side1Unit.removeChildren();
          break;
        }
        case "side2":
        {
          this.layers.side2Unit.removeChildren();
          break;
        }
      }
    }

    animateUnitSpriteEnter(unit: Unit, duration: number)
    {
      var direction = unit.battleStats.side === "side1" ? 1 : -1;
      this.animateUnitSpriteMovement(unit, duration, direction);
    }
    animateUnitSpriteExit(unit: Unit, duration: number)
    {
      var direction = unit.battleStats.side === "side1" ? -1 : 1;
      this.animateUnitSpriteMovement(unit, duration, direction);
    }
    animateUnits()
    {
      if (this.side1Unit && this.side1UnitSpeedX)
      {
        this.layers.side1Unit.x += this.side1UnitSpeedX;
      }

      if (this.side2Unit && this.side2UnitSpeedX)
      {
        this.layers.side2Unit.x += this.side2UnitSpeedX;
      }
    }
    enterUnitSprite(unit: Unit)
    {
      var currentUnitState = this.getUnitStateForSameSide(unit);
      if (currentUnitState === BattleSceneUnitState.entering)
      {
        // clear
        // trigger enter
        this.clearUnitSprite(unit);
        this.startUnitSpriteEnter(unit);
      }
      else if (currentUnitState === BattleSceneUnitState.stationary)
      {
        // trigger exit
        // on exit finish:
        //    trigger enter
        this.exitUnitSprite(unit);
        this.setUnitStateChangeCallback(unit, this.startUnitSpriteEnter.bind(this, unit));
      }
      else if (currentUnitState === BattleSceneUnitState.exiting)
      {
        // wait for exit
        // on exit finish:
        //    trigger enter
        this.setUnitStateChangeCallback(unit, this.startUnitSpriteEnter.bind(this, unit));
      }
    }
    startUnitSpriteEnter(unit: Unit)
    {
      this.setUnit(unit);
      this.setUnitState(unit, BattleSceneUnitState.entering);
      // TODO play animation
    }
    finishUnitSpriteEnter(unit: Unit)
    {
      this.setUnitState(unit, BattleSceneUnitState.stationary);
    }
    exitUnitSprite(unit: Unit)
    {
      var currentUnitState = this.getUnitStateForSameSide(unit);
      if (currentUnitState !== BattleSceneUnitState.stationary)
      {
        debugger;
        throw new Error("invalid unit animation state");
      }
      this.startUnitSpriteExit(unit);
    }
    startUnitSpriteExit(unit: Unit)
    {
      this.setUnitState(unit, BattleSceneUnitState.exiting);
      // TODO play animation
    }
    finishUnitSpriteExit(unit: Unit)
    {
      var callback = this.getUnitStateChangeCallback(unit);
      if (callback)
      {
        this.setUnitStateChangeCallback(unit, null);
        callback();
      }
      else
      {
        this.clearUnit(unit);
      }
    }

    // UNIT OVERLAY
    makeUnitOverlay(unit: Unit)
    {
      var side = unit.battleStats.side;
      var SFXParams = this.getSFXParams(
      {
        triggerStart: this.addUnitOverlay.bind(this, side),
        triggerEnd: this.clearUnitOverlay.bind(this, side)
      });
      this.activeSFX.battleOverlay(SFXParams);
    }
    addUnitOverlay(side: string, overlay: PIXI.DisplayObject)
    {
      this.clearUnitOverlay(side);

      if (side === "side1")
      {
        this.layers.side1UnitOverlay.addChild(overlay);
      }
      else if (side === "side2")
      {
        this.layers.side2UnitOverlay.addChild(overlay);
      }
      else
      {
        throw new Error("Invalid side " + side);
      }
    }
    clearUnitOverlay(side: string)
    {
      if (side === "side1")
      {
        this.layers.side1UnitOverlay.removeChildren();
      }
      else if (side === "side2")
      {
        this.layers.side2UnitOverlay.removeChildren();
      }
      else
      {
        throw new Error("Invalid side " + side);
      }
    }

    // RENDERING
    renderOnce()
    {
      this.forceFrame = true;
      this.render();
    }
    pause()
    {
      this.isPaused = true;
      this.forceFrame = false;
    }
    resume()
    {
      this.isPaused = false;
      this.forceFrame = false;
      this.render();
    }
    render()
    {
      if (this.isPaused)
      {
        if (this.forceFrame)
        {
          this.forceFrame = false;
        }
        else
        {
          return;
        }
      }

      this.renderer.render(this.container);

      window.requestAnimationFrame(this.render.bind(this));
    }
  }
}
