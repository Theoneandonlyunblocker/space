/// <reference path="../lib/pixi.d.ts" />

/// <reference path="templateinterfaces/IBattleSFXTemplate.d.ts" />

/// <reference path="unit.ts" />
/// <reference path="battlesceneunit.ts" />

module Rance
{
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
        side2Container: new PIXI.Container
      };

      this.side1Unit = new BattleSceneUnit(this.layers.side1Container, this.renderer);
      this.side2Unit = new BattleSceneUnit(this.layers.side2Container, this.renderer);

      this.side1Unit.getSceneBounds = this.side2Unit.getSceneBounds = this.getSceneBounds;

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
    
    setActiveSFX()
    {

    }
    clearActiveSFX()
    {
      this.activeSFX = null;
      this.clearBattleOverlay();
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

    // UNIT OVERLAY
    // makeUnitOverlay(unit: Unit)
    // {
    //   var side = unit.battleStats.side;
    //   var SFXParams = this.getSFXParams(
    //   {
    //     triggerStart: this.addUnitOverlay.bind(this, side),
    //     triggerEnd: this.clearUnitOverlay.bind(this, side)
    //   });
    //   this.activeSFX.battleOverlay(SFXParams);
    // }
    // addUnitOverlay(side: string, overlay: PIXI.DisplayObject)
    // {
    //   this.clearUnitOverlay(side);

    //   if (side === "side1")
    //   {
    //     this.layers.side1UnitOverlay.addChild(overlay);
    //   }
    //   else if (side === "side2")
    //   {
    //     this.layers.side2UnitOverlay.addChild(overlay);
    //   }
    //   else
    //   {
    //     throw new Error("Invalid side " + side);
    //   }
    // }
    // clearUnitOverlay(side: string)
    // {
    //   if (side === "side1")
    //   {
    //     this.layers.side1UnitOverlay.removeChildren();
    //   }
    //   else if (side === "side2")
    //   {
    //     this.layers.side2UnitOverlay.removeChildren();
    //   }
    //   else
    //   {
    //     throw new Error("Invalid side " + side);
    //   }
    // }

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
