import * as TWEEN from "@tweenjs/tween.js";
import * as PIXI from "pixi.js";

import {BattleVfxTemplate} from "../templateinterfaces/BattleVfxTemplate";
import {VfxParams} from "../templateinterfaces/VfxParams";

import {BattleSceneUnit} from "./BattleSceneUnit";
import {BattleSceneUnitOverlay} from "./BattleSceneUnitOverlay";
import {options} from "../app/Options";
import {Unit} from "../unit/Unit";
import {UnitBattleSide} from "../unit/UnitBattleSide";
import * as debug from "../app/debug";
import { AbilityUseEffectsForVfx } from "../abilities/AbilityUseEffectsForVfx";


// TODO performance
// BattleScene.render() shouldn't be called unless there's something new to render
//
export class BattleScene
{
  public targetUnit : Unit | null; // being targeted by ability      | priority
  public userUnit   : Unit | null; // using an ability               |
  public activeUnit : Unit | null; // currently acting in turn order |
  public hoveredUnit: Unit | null; // hovered by player              V


  private container: PIXI.Container;
  private renderer: PIXI.Renderer;
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

  private activeVfx: BattleVfxTemplate | null;
  private activeVfxAbilityUseEffects: AbilityUseEffectsForVfx | null;

  private side1UnitHasFinishedUpdating: boolean = false;
  private side2UnitHasFinishedUpdating: boolean = false;
  private afterUnitsHaveFinishedUpdatingCallback: (() => void) | null;

  private beforeUseDelayHasFinishedCallback: (() => void) | null;
  private afterUseDelayHasFinishedCallback: (() => void) | null;
  private abilityUseHasFinishedCallback: (() => void) | null;

  private onVfxStartCallback: (() => void) | null;

  private isPaused: boolean = false;
  private forceFrame: boolean = false;

  private resizeListener: (e: Event) => void;

  constructor(containerElement?: HTMLElement)
  {
    this.container = new PIXI.Container();

    this.renderer = new PIXI.Renderer(
      {
        width: 2, // set in this.bindRendererView()
        height: 2, // set in this.bindRendererView()
        autoDensity: false,
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
  public destroy(): void
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
  public bindRendererView(containerElement: HTMLElement): void
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
    vfxTemplate: BattleVfxTemplate;
    abilityUseEffects: AbilityUseEffectsForVfx;
    onVfxStart: () => void;
    user: Unit;
    target: Unit;
    afterFinished: () => void;
  }): void
  {
    this.clearActiveVfx();

    this.userUnit = props.user;
    this.targetUnit = props.target;
    this.activeVfx = props.vfxTemplate;
    this.activeVfxAbilityUseEffects = props.abilityUseEffects;

    this.onVfxStartCallback = props.onVfxStart;
    this.abilityUseHasFinishedCallback = props.afterFinished;

    this.beforeUseDelayHasFinishedCallback = this.playVfx.bind(this);
    this.prepareVfx();

    // this.prepareVfx();
    // this.playVfx();
    // props.triggerEffectCallback();
    // this.handleActiveVfxEnd();
    // props.afterFinishedCallback();
  }
  public updateUnits(afterFinishedUpdatingCallback?: () => void): void
  {
    debug.log("graphics", "updateUnits");

    let boundAfterFinishFN1: (() => void) | undefined;
    let boundAfterFinishFN2: (() => void) | undefined;
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

    this.side1Unit.setActiveUnit(activeSide1Unit, boundAfterFinishFN1);
    this.side1Overlay.activeUnit = activeSide1Unit;

    this.side2Unit.setActiveUnit(activeSide2Unit, boundAfterFinishFN2);
    this.side2Overlay.activeUnit = activeSide2Unit;
  }
  public renderOnce(): void
  {
    this.forceFrame = true;
    this.render();
  }
  public pause(): void
  {
    this.isPaused = true;
    this.forceFrame = false;
  }
  public resume(): void
  {
    this.isPaused = false;
    this.forceFrame = false;
    this.render();
  }

  private initLayers(): void
  {
    this.layers =
    {
      battleOverlay: new PIXI.Container(),
      side1Container: new PIXI.Container(),
      side2Container: new PIXI.Container(),
    };

    this.side1Unit = new BattleSceneUnit(this.layers.side1Container, this.renderer, "side1");
    this.side2Unit = new BattleSceneUnit(this.layers.side2Container, this.renderer, "side2");
    this.side1Unit.getSceneBounds = this.side2Unit.getSceneBounds = this.getSceneBounds;

    this.side1Overlay = new BattleSceneUnitOverlay(this.layers.side1Container, this.renderer);
    this.side2Overlay = new BattleSceneUnitOverlay(this.layers.side2Container, this.renderer);
    this.side1Overlay.getSceneBounds = this.side2Overlay.getSceneBounds = this.getSceneBounds;

    this.container.addChild(this.layers.side1Container);
    this.container.addChild(this.layers.side2Container);
    this.container.addChild(this.layers.battleOverlay);
  }
  private handleResize(): void
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
  private getSceneBounds(): {width: number; height: number}
  {
    return(
    {
      width: this.renderer.width,
      height: this.renderer.height,
    });
  }
  private getVfxParams(props:
  {
    triggerStart: (container: PIXI.DisplayObject) => void;
    triggerEnd: () => void;
  }): VfxParams
  {
    const bounds = this.getSceneBounds();
    const duration = this.activeVfx.duration * options.battle.animationTiming.effectDuration;

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
      abilityUseEffects: this.activeVfxAbilityUseEffects,
      triggerStart: props.triggerStart,
      triggerEnd: props.triggerEnd,
    });
  }
  private getHighestPriorityUnitForSide(side: UnitBattleSide): Unit | null
  {
    const units: (Unit | null)[] = [];

    if (this.activeVfx)
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
  private haveBothUnitsFinishedUpdating(): boolean
  {
    return this.side1UnitHasFinishedUpdating && this.side2UnitHasFinishedUpdating;
  }
  private executeIfBothUnitsHaveFinishedUpdating(): void
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
  private finishUpdatingUnit(side: UnitBattleSide): void
  {
    debug.log("graphics", "finishUpdatingUnit", side);

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
  private executeBeforeUseDelayHasFinishedCallback(): void
  {
    if (!this.beforeUseDelayHasFinishedCallback)
    {
      throw new Error("No callback set for 'before ability use delay' finish.");
    }

    const temp = this.beforeUseDelayHasFinishedCallback;
    this.beforeUseDelayHasFinishedCallback = null;
    temp();
  }
  private executeOnVfxStartCallback(): void
  {
    if (this.onVfxStartCallback)
    {
      const temp = this.onVfxStartCallback;
      this.onVfxStartCallback = null;
      temp();
    }
  }
  private executeSquashedAbilityUseEffect(): void
  {
    if (this.activeVfxAbilityUseEffects)
    {
      const temp = this.activeVfxAbilityUseEffects;
      this.activeVfxAbilityUseEffects = null;

      temp.triggerAllEffects();
    }
  }
  private executeAfterUseDelayHasFinishedCallback(): void
  {
    if (!this.afterUseDelayHasFinishedCallback)
    {
      throw new Error("No callback set for 'after ability use delay' finish.");
    }

    const temp = this.afterUseDelayHasFinishedCallback;
    this.afterUseDelayHasFinishedCallback = null;
    temp();
  }
  private executeAbilityUseHasFinishedCallback(): void
  {
    if (!this.abilityUseHasFinishedCallback)
    {
      throw new Error("No callback set for ability use finish.");
    }

    const temp = this.abilityUseHasFinishedCallback;
    this.abilityUseHasFinishedCallback = null;
    temp();
  }

  private prepareVfx(): void
  {
    const beforeUseDelay = options.battle.animationTiming.before;

    const afterUnitsHaveFinishedUpdatingCallback = () =>
    {
      if (beforeUseDelay >= 0)
      {
        setTimeout(this.executeBeforeUseDelayHasFinishedCallback.bind(this),
          beforeUseDelay);
      }
      else
      {
        this.executeBeforeUseDelayHasFinishedCallback();
      }
    };

    this.updateUnits(afterUnitsHaveFinishedUpdatingCallback);
  }
  private playVfx(): void
  {
    const vfxDuration = options.battle.animationTiming.effectDuration * this.activeVfx!.duration;

    this.executeOnVfxStartCallback();

    if (!this.activeVfx!.vfxWillTriggerEffect || vfxDuration <= 0)
    {
      this.executeSquashedAbilityUseEffect();
    }

    if (vfxDuration <= 0)
    {
      this.handleActiveVfxEnd();
    }
    else
    {
      this.triggerVfxStart(
        this.activeVfx!,
        this.userUnit,
        this.targetUnit,
        this.handleActiveVfxEnd.bind(this)
      );
    }
  }
  private clearActiveVfx(): void
  {
    this.activeVfx = null;
    this.activeVfxAbilityUseEffects = null;

    this.userUnit = null;
    this.targetUnit = null;

    this.clearBattleOverlay();
    this.clearUnitOverlays();
  }
  private handleActiveVfxEnd(): void
  {
    const afterUseDelay = options.battle.animationTiming.after;

    this.afterUseDelayHasFinishedCallback = () =>
    {
      this.clearActiveVfx();
      this.executeAbilityUseHasFinishedCallback();
    };

    if (afterUseDelay >= 0)
    {
      setTimeout(this.executeAfterUseDelayHasFinishedCallback.bind(this), afterUseDelay);
    }
    else
    {
      this.executeAfterUseDelayHasFinishedCallback();
    }
  }
  private triggerVfxStart(
    vfxTemplate: BattleVfxTemplate,
    user: Unit,
    target: Unit,
    afterFinishedCallback: () => void,
  ): void
  {
    this.activeVfx = vfxTemplate;
    this.side1Unit.setVfx(vfxTemplate, user, target);
    this.side2Unit.setVfx(vfxTemplate, user, target);
    this.side1Overlay.setVfx(vfxTemplate, user, target);
    this.side2Overlay.setVfx(vfxTemplate, user, target);
    this.makeBattleOverlay(afterFinishedCallback);
  }
  private makeBattleOverlay(afterFinishedCallback: () => void): void
  {
    if (!this.activeVfx)
    {
      throw new Error("Tried to make battle overlay without active Vfx");
    }

    if (!this.activeVfx.battleOverlay)
    {
      afterFinishedCallback();
    }
    else
    {
      const vfxParams = this.getVfxParams(
      {
        triggerStart: this.addBattleOverlay.bind(this),
        triggerEnd: afterFinishedCallback,
      });

      this.activeVfx.battleOverlay(vfxParams);
    }
  }
  private addBattleOverlay(overlay: PIXI.DisplayObject): void
  {
    this.layers.battleOverlay.addChild(overlay);
  }
  private clearBattleOverlay(): void
  {
    this.layers.battleOverlay.removeChildren();
  }
  private clearUnitOverlays(): void
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
  private render(): void
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
