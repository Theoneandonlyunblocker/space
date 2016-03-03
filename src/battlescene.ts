/// <reference path="../lib/pixi.d.ts" />

/// <reference path="templateinterfaces/IBattleSFXTemplate.d.ts" />

/// <reference path="unit.ts" />
/// <reference path="battlesceneunit.ts" />
/// <reference path="battlesceneunitoverlay.ts" />

module Rance
{
  // TODO performance
  // BattleScene.render() shouldn't be called unless there's something new to render
  // 
  export class BattleScene
  {
    container: PIXI.Container;
    renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
    pixiContainer: HTMLElement;

    layers:
    {
      battleOverlay: PIXI.Container;
      side1Container: PIXI.Container;
      side2Container: PIXI.Container;
    };

    side1Unit: BattleSceneUnit;
    side2Unit: BattleSceneUnit;

    side1Overlay: BattleSceneUnitOverlay;
    side2Overlay: BattleSceneUnitOverlay;

    activeSFX: Templates.IBattleSFXTemplate;

    targetUnit: Unit;  // being targeted by ability | priority
    userUnit: Unit;    // using an ability          |
    activeUnit: Unit;  // next to act in turn order |
    hoveredUnit: Unit; // hovered by player         V

    side1UnitHasFinishedUpdating: boolean = false;
    side2UnitHasFinishedUpdating: boolean = false;
    afterUnitsHaveFinishedUpdatingCallback: () => void;

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
          antialias: true,
          transparent: true
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
        side2Container: new PIXI.Container
      };

      this.side1Unit = new BattleSceneUnit(this.layers.side1Container, this.renderer);
      this.side2Unit = new BattleSceneUnit(this.layers.side2Container, this.renderer);
      this.side1Unit.getSceneBounds = this.side2Unit.getSceneBounds = this.getSceneBounds;

      this.side1Overlay = new BattleSceneUnitOverlay(this.layers.side1Container, this.renderer);
      this.side2Overlay = new BattleSceneUnitOverlay(this.layers.side2Container, this.renderer);
      this.side1Overlay.getSceneBounds = this.side2Overlay.getSceneBounds = this.getSceneBounds;

      this.container.addChild(this.layers.side1Container);
      this.container.addChild(this.layers.side2Container);
      this.container.addChild(this.layers.battleOverlay);
    }
    handleResize()
    {
      var w = this.pixiContainer.offsetWidth * window.devicePixelRatio;
      var h = this.pixiContainer.offsetHeight * window.devicePixelRatio;
      this.renderer.resize(w, h);

      this.side1Unit.resize();
      this.side2Unit.resize();
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
      var duration = this.activeSFX.duration * Options.battleAnimationTiming.effectDuration;

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
    
    getHighestPriorityUnitForSide(side: UnitBattleSide)
    {
      var units =
      [
        this.targetUnit,
        this.userUnit,
        this.activeUnit,
        this.hoveredUnit
      ];

      for (var i = 0; i < units.length; i++)
      {
        var unit = units[i];
        if (unit && unit.battleStats.side === side)
        {
          return unit;
        }
      }

      return null;
    }
    haveBothUnitsFinishedUpdating()
    {
      return this.side1UnitHasFinishedUpdating && this.side2UnitHasFinishedUpdating;
    }
    executeIfBothUnitsHaveFinishedUpdating()
    {
      if (!this.afterUnitsHaveFinishedUpdatingCallback || !this.haveBothUnitsFinishedUpdating())
      {
        return;
      }
      else
      {
        this.afterUnitsHaveFinishedUpdatingCallback();
        this.afterUnitsHaveFinishedUpdatingCallback = null;
      }
    }
    finishUpdatingUnit(side: UnitBattleSide)
    {
      if (side === "side1")
      {
        this.side1UnitHasFinishedUpdating = true;
      }
      else
      {
        this.side2UnitHasFinishedUpdating = true;
      }

      this.executeIfBothUnitsHaveFinishedUpdating();
    }
    updateUnits(afterFinishedUpdatingCallback?: () => void)
    {
      var boundAfterFinishFN1: () => void = null;
      var boundAfterFinishFN2: () => void = null;
      if (afterFinishedUpdatingCallback)
      {
        this.afterUnitsHaveFinishedUpdatingCallback = afterFinishedUpdatingCallback;

        boundAfterFinishFN1 = this.finishUpdatingUnit.bind(this, "side1");
        boundAfterFinishFN2 = this.finishUpdatingUnit.bind(this, "side2");

        this.side1UnitHasFinishedUpdating = false;
        this.side2UnitHasFinishedUpdating = false;
      }

      var activeSide1Unit = this.getHighestPriorityUnitForSide("side1");
      var activeSide2Unit = this.getHighestPriorityUnitForSide("side2");

      this.side1Unit.changeActiveUnit(activeSide1Unit, boundAfterFinishFN1);
      this.side1Overlay.activeUnit = activeSide1Unit;

      this.side2Unit.changeActiveUnit(activeSide2Unit, boundAfterFinishFN2);
      this.side2Overlay.activeUnit = activeSide2Unit;
    }
    setActiveSFX(SFXTemplate: Templates.IBattleSFXTemplate, user: Unit, target: Unit)
    {
      this.clearActiveSFX();

      if (Options.battleAnimationTiming.effectDuration <= 0)
      {
        this.updateUnits();
        return;
      }

      this.userUnit = user;
      this.targetUnit = target;

      this.updateUnits(this.triggerSFXStart.bind(this, SFXTemplate, user, target));
    }
    clearActiveSFX()
    {
      this.activeSFX = null;

      this.userUnit = null;
      this.targetUnit = null;

      this.clearBattleOverlay();
      this.clearUnitOverlays();
    }
    triggerSFXStart(SFXTemplate: Templates.IBattleSFXTemplate, user: Unit, target: Unit)
    {
      this.activeSFX = SFXTemplate;
      this.side1Unit.setSFX(SFXTemplate, user, target);
      this.side2Unit.setSFX(SFXTemplate, user, target);
      this.side1Overlay.setSFX(SFXTemplate, user, target);
      this.side2Overlay.setSFX(SFXTemplate, user, target);
      this.makeBattleOverlay();
    }
    makeBattleOverlay()
    {
      var SFXParams = this.getSFXParams(
      {
        triggerStart: this.addBattleOverlay.bind(this),
        triggerEnd: this.clearActiveSFX.bind(this)
      });
      this.activeSFX.battleOverlay(SFXParams);
    }
    addBattleOverlay(overlay: PIXI.DisplayObject)
    {
      this.layers.battleOverlay.addChild(overlay);
    }
    clearBattleOverlay()
    {
      this.layers.battleOverlay.removeChildren();
    }
    clearUnitOverlays()
    {
      this.side1Overlay.clearOverlay();
      this.side2Overlay.clearOverlay();
    }

    getBattleSceneUnit(unit: Unit): BattleSceneUnit
    {
      switch (unit.battleStats.side)
      {
        case "side1":
        {
          return this.side1Unit;
        }
        case "side2":
        {
          return this.side2Unit;
        }
      }
    }
    getBattleSceneUnitOverlay(unit: Unit): BattleSceneUnitOverlay
    {
      switch (unit.battleStats.side)
      {
        case "side1":
        {
          return this.side1Overlay;
        }
        case "side2":
        {
          return this.side2Overlay;
        }
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
    render(timeStamp?: number)
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
      TWEEN.update();

      window.requestAnimationFrame(this.render.bind(this));
    }
  }
}
