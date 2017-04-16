/// <reference path="../lib/pixi.d.ts" />

import BattleSFXTemplate from "./templateinterfaces/BattleSFXTemplate";
import SFXParams from "./templateinterfaces/SFXParams";

import BattleSceneUnit from "./BattleSceneUnit";
import BattleSceneUnitOverlay from "./BattleSceneUnitOverlay";
import Options from "./Options";
import Unit from "./Unit";
import UnitBattleSide from "./UnitBattleSide";

// TODO performance
// BattleScene.render() shouldn't be called unless there's something new to render
//
export default class BattleScene
{
  public targetUnit: Unit;  // being targeted by ability      | priority
  public userUnit: Unit;    // using an ability               |
  public activeUnit: Unit;  // currently acting in turn order |
  public hoveredUnit: Unit; // hovered by player              V


  private container: PIXI.Container;
  private renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
  private containerElement: HTMLElement;

  private layers:
  {
    battleOverlay: PIXI.Container;
    side1Container: PIXI.Container;
    side2Container: PIXI.Container;
  };

  private side1Unit: BattleSceneUnit;
  private side2Unit: BattleSceneUnit;

  private side1Overlay: BattleSceneUnitOverlay;
  private side2Overlay: BattleSceneUnitOverlay;

  private activeSFX: BattleSFXTemplate;

  private side1UnitHasFinishedUpdating: boolean = false;
  private side2UnitHasFinishedUpdating: boolean = false;
  private afterUnitsHaveFinishedUpdatingCallback: () => void;

  private beforeUseDelayHasFinishedCallback: () => void;
  private activeSFXHasFinishedCallback: () => void;
  private afterUseDelayHasFinishedCallback: () => void;
  private abilityUseHasFinishedCallback: () => void;

  private onSFXStartCallback: () => void;
  private triggerEffectCallback: () => void;

  private isPaused: boolean = false;
  private forceFrame: boolean = false;

  private resizeListener: (e: Event) => void;

  constructor(containerElement?: HTMLElement)
  {
    this.container = new PIXI.Container();

    this.renderer = PIXI.autoDetectRenderer(
      2, // set in this.bindRendererView()
      2, // set in this.bindRendererView()
      {
        autoResize: false,
        antialias: true,
        transparent: true,
      },
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
    onSFXStartCallback: () => void;
    user: Unit;
    target: Unit;
    afterFinishedCallback: () => void;
  })
  {
    this.clearActiveSFX();

    this.userUnit = props.user;
    this.targetUnit = props.target;
    this.activeSFX = props.SFXTemplate;

    this.onSFXStartCallback = props.onSFXStartCallback;
    this.abilityUseHasFinishedCallback = props.afterFinishedCallback;
    this.activeSFXHasFinishedCallback = this.handleActiveSFXEnd.bind(this);

    this.triggerEffectCallback = props.triggerEffectCallback;
    this.beforeUseDelayHasFinishedCallback = this.playSFX.bind(this);
    this.prepareSFX();

    // this.prepareSFX();
    // this.playSFX();
    // props.triggerEffectCallback();
    // this.handleActiveSFXEnd();
    // props.afterFinishedCallback();
  }
  public updateUnits(afterFinishedUpdatingCallback?: () => void)
  {
    let boundAfterFinishFN1: () => void = null;
    let boundAfterFinishFN2: () => void = null;
    if (afterFinishedUpdatingCallback)
    {
      this.afterUnitsHaveFinishedUpdatingCallback = afterFinishedUpdatingCallback;

      boundAfterFinishFN1 = this.finishUpdatingUnit.bind(this, "side1");
      boundAfterFinishFN2 = this.finishUpdatingUnit.bind(this, "side2");

      this.side1UnitHasFinishedUpdating = false;
      this.side2UnitHasFinishedUpdating = false;
    }

    const activeSide1Unit = this.getHighestPriorityUnitForSide("side1");
    const activeSide2Unit = this.getHighestPriorityUnitForSide("side2");

    this.side1Unit.changeActiveUnit(activeSide1Unit, boundAfterFinishFN1);
    this.side1Overlay.activeUnit = activeSide1Unit;

    this.side2Unit.changeActiveUnit(activeSide2Unit, boundAfterFinishFN2);
    this.side2Overlay.activeUnit = activeSide2Unit;
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
      battleOverlay: new PIXI.Container(),
      side1Container: new PIXI.Container(),
      side2Container: new PIXI.Container(),
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
    const w = this.containerElement.clientWidth * window.devicePixelRatio;
    const h = this.containerElement.clientHeight * window.devicePixelRatio;
    this.renderer.resize(w, h);

    this.side1Unit.resize();
    this.side2Unit.resize();
  }
  private getSceneBounds()
  {
    return(
    {
      width: this.renderer.width,
      height: this.renderer.height,
    });
  }
  private getSFXParams(props:
  {
    triggerStart: (container: PIXI.DisplayObject) => void;
    triggerEnd?: () => void;
  }): SFXParams
  {
    const bounds = this.getSceneBounds();
    const duration = this.activeSFX.duration * Options.battleAnimationTiming.effectDuration;

    return(
    {
      user: this.userUnit,
      target: this.targetUnit,
      userOffset: this.getBattleSceneUnit(this.userUnit).spriteContainer.position,
      targetOffset: this.getBattleSceneUnit(this.targetUnit).spriteContainer.position,
      width: bounds.width,
      height: bounds.height,
      duration: duration,
      facingRight: this.userUnit.battleStats.side === "side1",
      renderer: this.renderer,
      triggerStart: props.triggerStart,
      triggerEffect: this.executeTriggerEffectCallback.bind(this),
      triggerEnd: props.triggerEnd,
    });
  }
  private getHighestPriorityUnitForSide(side: UnitBattleSide)
  {
    const units: Unit[] = [];

    if (Boolean(this.activeSFX))
    {
      units.push(this.targetUnit, this.userUnit);
    }
    else
    {
      units.push(this.activeUnit, this.hoveredUnit);
    }

    for (let i = 0; i < units.length; i++)
    {
      const unit = units[i];
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
      const temp = this.afterUnitsHaveFinishedUpdatingCallback;
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

    const temp = this.beforeUseDelayHasFinishedCallback;
    this.beforeUseDelayHasFinishedCallback = null;
    temp();
  }
  private executeOnSFXStartCallback()
  {
    if (this.onSFXStartCallback)
    {
      const temp = this.onSFXStartCallback;
      this.onSFXStartCallback = null;
      temp();
    }
  }
  private executeTriggerEffectCallback()
  {
    if (this.triggerEffectCallback)
    {
      const temp = this.triggerEffectCallback;
      this.triggerEffectCallback = null;
      temp();
    }
  }
  // unused
  // private executeActiveSFXHasFinishedCallback()
  // {
  //   if (!this.activeSFXHasFinishedCallback)
  //   {
  //     throw new Error("No callback set for active SFX finish.");
  //   }

  //   const temp = this.activeSFXHasFinishedCallback;
  //   this.activeSFXHasFinishedCallback = null;
  //   temp();
  // }
  private executeAfterUseDelayHasFinishedCallback()
  {
    if (!this.afterUseDelayHasFinishedCallback)
    {
      throw new Error("No callback set for 'after ability use delay' finish.");
    }

    const temp = this.afterUseDelayHasFinishedCallback;
    this.afterUseDelayHasFinishedCallback = null;
    temp();
  }
  private executeAbilityUseHasFinishedCallback()
  {
    if (!this.abilityUseHasFinishedCallback)
    {
      throw new Error("No callback set for ability use finish.");
    }

    const temp = this.abilityUseHasFinishedCallback;
    this.abilityUseHasFinishedCallback = null;
    temp();
  }

  private prepareSFX()
  {
    const beforeUseDelay = Options.battleAnimationTiming.before;

    const afterUnitsHaveFinishedUpdatingCallback = () =>
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
    };

    this.updateUnits(afterUnitsHaveFinishedUpdatingCallback);
  }
  private playSFX()
  {
    const SFXDuration = Options.battleAnimationTiming.effectDuration *
      this.activeSFX.duration;

    this.executeOnSFXStartCallback();

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
  private clearActiveSFX()
  {
    this.activeSFX = null;

    this.userUnit = null;
    this.targetUnit = null;

    this.clearBattleOverlay();
    this.clearUnitOverlays();
  }
  private handleActiveSFXEnd()
  {
    const afterUseDelay = Options.battleAnimationTiming.after;

    this.afterUseDelayHasFinishedCallback = () =>
    {
      this.clearActiveSFX();
      this.updateUnits(this.executeAbilityUseHasFinishedCallback.bind(this));
    };

    if (afterUseDelay >= 0)
    {
      window.setTimeout(this.executeAfterUseDelayHasFinishedCallback.bind(this), afterUseDelay);
    }
    else
    {
      this.executeAfterUseDelayHasFinishedCallback();
    }
  }
  private triggerSFXStart(
    SFXTemplate: BattleSFXTemplate,
    user: Unit,
    target: Unit,
    afterFinishedCallback?: () => void,
  )
  {
    this.activeSFX = SFXTemplate;
    this.side1Unit.setSFX(SFXTemplate, user, target);
    this.side2Unit.setSFX(SFXTemplate, user, target);
    this.side1Overlay.setSFX(SFXTemplate, user, target);
    this.side2Overlay.setSFX(SFXTemplate, user, target);
    this.makeBattleOverlay(afterFinishedCallback);
  }
  private makeBattleOverlay(afterFinishedCallback: () => void)
  {
    if (!this.activeSFX.battleOverlay)
    {
      afterFinishedCallback();
    }
    else
    {
      const SFXParams = this.getSFXParams(
      {
        triggerStart: this.addBattleOverlay.bind(this),
        triggerEnd: afterFinishedCallback,
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
  // unused
  // private getBattleSceneUnitOverlay(unit: Unit): BattleSceneUnitOverlay
  // {
  //   switch (unit.battleStats.side)
  //   {
  //     case "side1":
  //     {
  //       return this.side1Overlay;
  //     }
  //     case "side2":
  //     {
  //       return this.side2Overlay;
  //     }
  //   }
  // }
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
