/// <reference path="../lib/pixi.d.ts" />

import BattleSFXTemplate from "./templateinterfaces/BattleSFXTemplate";
import SFXParams from "./templateinterfaces/SFXParams";

import Unit from "./Unit";
import BattleSceneUnit from "./BattleSceneUnit";
import BattleSceneUnitOverlay from "./BattleSceneUnitOverlay";
import Options from "./options";
import UnitBattleSide from "./UnitBattleSide";

// TODO performance
// BattleScene.render() shouldn't be called unless there's something new to render
// 
export default class BattleScene
{
  container: PIXI.Container;
  renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
  containerElement: HTMLElement;

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

  activeSFX: BattleSFXTemplate;

  targetUnit: Unit;  // being targeted by ability      | priority
  userUnit: Unit;    // using an ability               |
  activeUnit: Unit;  // currently acting in turn order |
  hoveredUnit: Unit; // hovered by player              V

  side1UnitHasFinishedUpdating: boolean = false;
  side2UnitHasFinishedUpdating: boolean = false;
  afterUnitsHaveFinishedUpdatingCallback: () => void;

  beforeUseDelayHasFinishedCallback: () => void;
  activeSFXHasFinishedCallback: () => void;
  afterUseDelayHasFinishedCallback: () => void;
  abilityUseHasFinishedCallback: () => void;

  triggerEffectCallback: () => void;

  isPaused: boolean = false;
  forceFrame: boolean = false;

  resizeListener: (e: Event) => void;

  constructor(containerElement?: HTMLElement)
  {
    this.container = new PIXI.Container();
    this.containerElement = containerElement;
    
    this.renderer = PIXI.autoDetectRenderer(
      2, // set in this.bindRendererView()
      2, // set in this.bindRendererView()
      {
        autoResize: false,
        antialias: true,
        transparent: true
      }
    );
    
    this.renderer.view.setAttribute("id", "battle-scene-pixi-canvas");
        
    this.initLayers();

    this.resizeListener = this.handleResize.bind(this);
    window.addEventListener("resize", this.resizeListener, false);
    
    if (containerElement)
    {
      this.bindRendererView(containerElement);
    }
  }
  public destroy()
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
    this.containerElement = null;

    window.removeEventListener("resize", this.resizeListener);
  }
  public bindRendererView(containerElement: HTMLElement)
  {
    if (this.containerElement)
    {
      this.containerElement.removeChild(this.renderer.view);
    }
    
    this.containerElement = containerElement;
    
    if (this.renderer)
    {
      this.handleResize();
    }
    
    this.containerElement.appendChild(this.renderer.view);
  }
  public handleAbilityUse(props:
  {
    SFXTemplate: BattleSFXTemplate;
    triggerEffectCallback: () => void;
    user: Unit;
    target: Unit;
    afterFinishedCallback: () => void;
  })
  {
    this.clearActiveSFX();

    this.userUnit = props.user;
    this.targetUnit = props.target;
    this.activeSFX = props.SFXTemplate;


    this.abilityUseHasFinishedCallback = props.afterFinishedCallback;
    this.activeSFXHasFinishedCallback = this.cleanUpAfterSFX.bind(this);

    this.triggerEffectCallback = props.triggerEffectCallback;
    this.beforeUseDelayHasFinishedCallback = this.playSFX.bind(this);
    this.prepareSFX();

    // this.prepareSFX();
    // this.playSFX();
    // props.triggerEffectCallback();
    // this.cleanUpAfterSFX();
    // props.afterFinishedCallback();
  }
  public updateUnits(afterFinishedUpdatingCallback?: () => void)
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
  public clearActiveSFX()
  {
    this.activeSFX = null;

    this.userUnit = null;
    this.targetUnit = null;

    this.clearBattleOverlay();
    this.clearUnitOverlays();
  }
  public renderOnce()
  {
    this.forceFrame = true;
    this.render();
  }
  public pause()
  {
    this.isPaused = true;
    this.forceFrame = false;
  }
  public resume()
  {
    this.isPaused = false;
    this.forceFrame = false;
    this.render();
  }
  
  private initLayers()
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
  private handleResize()
  {
    if (!this.containerElement)
    {
      return;
    }
    var w = this.containerElement.clientWidth * window.devicePixelRatio;
    var h = this.containerElement.clientHeight * window.devicePixelRatio;
    this.renderer.resize(w, h);

    this.side1Unit.resize();
    this.side2Unit.resize();
  }
  private getSceneBounds()
  {
    return(
    {
      width: this.renderer.width,
      height: this.renderer.height
    });
  }
  private getSFXParams(props:
  {
    triggerStart: (container: PIXI.DisplayObject) => void;
    triggerEnd?: () => void;
  }): SFXParams
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
      triggerEffect: this.executeTriggerEffectCallback.bind(this),
      triggerEnd: props.triggerEnd
    });
  }
  private getHighestPriorityUnitForSide(side: UnitBattleSide)
  {
    var units =
    [
      this.targetUnit,
      this.userUnit,
      this.activeUnit,
      this.hoveredUnit
    ];

    for (let i = 0; i < units.length; i++)
    {
      var unit = units[i];
      if (unit && unit.battleStats.side === side)
      {
        return unit;
      }
    }

    return null;
  }
  private haveBothUnitsFinishedUpdating()
  {
    return this.side1UnitHasFinishedUpdating && this.side2UnitHasFinishedUpdating;
  }
  private executeIfBothUnitsHaveFinishedUpdating()
  {
    if (this.afterUnitsHaveFinishedUpdatingCallback && this.haveBothUnitsFinishedUpdating())
    {
      var temp = this.afterUnitsHaveFinishedUpdatingCallback
      this.afterUnitsHaveFinishedUpdatingCallback = null;
      temp();
    }
    else
    {
      return;
    }
  }
  private finishUpdatingUnit(side: UnitBattleSide)
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
  private executeBeforeUseDelayHasFinishedCallback()
  {
    if (!this.beforeUseDelayHasFinishedCallback)
    {
      throw new Error("No callback set for 'before ability use delay' finish.");
    }

    var temp = this.beforeUseDelayHasFinishedCallback;
    this.beforeUseDelayHasFinishedCallback = null;
    temp();
  }
  private executeTriggerEffectCallback()
  {
    if (!this.triggerEffectCallback)
    {
      return;
      // throw new Error("No callback set for triggering battle effects.");
    }

    var temp = this.triggerEffectCallback;
    this.triggerEffectCallback = null;
    temp();
  }
  private executeActiveSFXHasFinishedCallback()
  {
    if (!this.activeSFXHasFinishedCallback)
    {
      throw new Error("No callback set for active SFX finish.");
    }

    var temp = this.activeSFXHasFinishedCallback;
    this.activeSFXHasFinishedCallback = null;
    temp();
  }
  private executeAfterUseDelayHasFinishedCallback()
  {
    if (!this.afterUseDelayHasFinishedCallback)
    {
      throw new Error("No callback set for 'after ability use delay' finish.");
    }

    var temp = this.afterUseDelayHasFinishedCallback;
    this.afterUseDelayHasFinishedCallback = null;
    temp();
  }
  private executeAbilityUseHasFinishedCallback()
  {
    if (!this.abilityUseHasFinishedCallback)
    {
      throw new Error("No callback set for ability use finish.");
    }

    var temp = this.abilityUseHasFinishedCallback;
    this.abilityUseHasFinishedCallback = null;
    temp();
  }

  private prepareSFX()
  {
    var beforeUseDelay = Options.battleAnimationTiming.before;

    var afterUnitsHaveFinishedUpdatingCallback = function()
    {
      if (beforeUseDelay >= 0)
      {
        window.setTimeout(this.executeBeforeUseDelayHasFinishedCallback.bind(this),
          beforeUseDelay);
      }
      else
      {
        this.executeBeforeUseDelayHasFinishedCallback();
      }
    }.bind(this);

    this.updateUnits(afterUnitsHaveFinishedUpdatingCallback);
  }
  private playSFX()
  {
    var SFXDuration = Options.battleAnimationTiming.effectDuration *
      this.activeSFX.duration;

    if (!this.activeSFX.SFXWillTriggerEffect || SFXDuration <= 0)
    {
      this.executeTriggerEffectCallback();
    }
    
    if (SFXDuration <= 0)
    {
      this.handleActiveSFXEnd();
    }
    else
    {
      this.triggerSFXStart(this.activeSFX, this.userUnit,
        this.targetUnit, this.handleActiveSFXEnd.bind(this));
    }
  }
  private handleActiveSFXEnd()
  {
    this.activeSFX = null;
    this.clearBattleOverlay();
    this.clearUnitOverlays();
    this.executeActiveSFXHasFinishedCallback();
  }
  private cleanUpAfterSFX()
  {
    var afterUseDelay = Options.battleAnimationTiming.after;

    this.afterUseDelayHasFinishedCallback = function()
    {
      this.userUnit = null;
      this.targetUnit = null;
      this.updateUnits(this.executeAbilityUseHasFinishedCallback.bind(this));
    }.bind(this);

    if (afterUseDelay >= 0)
    {
      window.setTimeout(this.executeAfterUseDelayHasFinishedCallback.bind(this), afterUseDelay);
    }
    else
    {
      this.executeAfterUseDelayHasFinishedCallback();
    }
  }
  private triggerSFXStart(SFXTemplate: BattleSFXTemplate, user: Unit, target: Unit,
    afterFinishedCallback?: () => void)
  {
    this.activeSFX = SFXTemplate;
    this.side1Unit.setSFX(SFXTemplate, user, target);
    this.side2Unit.setSFX(SFXTemplate, user, target);
    this.side1Overlay.setSFX(SFXTemplate, user, target);
    this.side2Overlay.setSFX(SFXTemplate, user, target);
    this.makeBattleOverlay(afterFinishedCallback);
  }
  private makeBattleOverlay(afterFinishedCallback: () => void = this.clearActiveSFX.bind(this))
  {
    if (!this.activeSFX.battleOverlay)
    {
      afterFinishedCallback();
    }
    else
    {
      var SFXParams = this.getSFXParams(
      {
        triggerStart: this.addBattleOverlay.bind(this),
        triggerEnd: afterFinishedCallback
      });
      this.activeSFX.battleOverlay(SFXParams);
    }
  }
  private addBattleOverlay(overlay: PIXI.DisplayObject)
  {
    this.layers.battleOverlay.addChild(overlay);
  }
  private clearBattleOverlay()
  {
    this.layers.battleOverlay.removeChildren();
  }
  private clearUnitOverlays()
  {
    this.side1Overlay.clearOverlay();
    this.side2Overlay.clearOverlay();
  }

  private getBattleSceneUnit(unit: Unit): BattleSceneUnit
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
  private getBattleSceneUnitOverlay(unit: Unit): BattleSceneUnitOverlay
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
  private render(timeStamp?: number)
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
