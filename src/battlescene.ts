/// <reference path="../lib/pixi.d.ts" />

/// <reference path="templateinterfaces/IBattleSFXTemplate.d.ts" />

/// <reference path="unit.ts" />

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
      side1UnitOverlay: PIXI.Container;
      side1Unit: PIXI.Container;
      side2Container: PIXI.Container;
      side2UnitOverlay: PIXI.Container;
      side2Unit: PIXI.Container;
    };
    side1Unit: Unit;
    side2Unit: Unit;

    activeSFX: Templates.IBattleSFXTemplate;
    activeUnit: Unit;

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

    getSFXParams(triggerStart: (container: PIXI.Container) => void,
      triggerEnd: () => void)
    {
      var bounds = this.getSceneBounds();
      var duration = this.activeSFX.duration; // TODO options timing

      return(
      {
        user: this.activeUnit,
        target: this.activeUnit, // TODO
        width: bounds.width,
        height: bounds.height,
        duration: duration,
        facingRight: this.activeUnit.battleStats.side === "side1",
        renderer: this.renderer,
        triggerStart: triggerStart,
        triggerEnd: triggerEnd
      });
    }

    makeUnitSprite(unit: Unit)
    {

    }
    makeBattleOverlay()
    {
      var SFXParams = this.getSFXParams(this.addBattleOverlay, this.clearBattleOverlay);
      this.activeSFX.battleOverlay(SFXParams);
    }
    addBattleOverlay(overlay: PIXI.Container)
    {
      this.clearBattleOverlay();
      this.layers.battleOverlay.addChild(overlay);
    }
    clearBattleOverlay()
    {
      this.layers.battleOverlay.removeChildren();
    }
    makeUnitOverlay(unit: Unit)
    {
      var side = unit.battleStats.side;
      var SFXParams = this.getSFXParams(this.addUnitOverlay.bind(this, side),
        this.clearUnitOverlay.bind(this, side));
      this.activeSFX.battleOverlay(SFXParams);
    }
    addUnitOverlay(side: string, overlay: PIXI.Container)
    {
      this.clearUnitOverlay(side);

      if (side === "side1")
      {
        this.layers.side1UnitOverlay.addChild(overlay);
      }
      else if (side === "side2")
      {
        this.layers.side1UnitOverlay.addChild(overlay);
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
    enterUnit(unit: Unit)
    {

    }
    exitUnit()
    {
      // clear overlay
    }
  }
}
