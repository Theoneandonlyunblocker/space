import * as PIXI from "pixi.js";

import {BattleVfxTemplate} from "./templateinterfaces/BattleVfxTemplate";
import {VfxParams} from "./templateinterfaces/VfxParams";

import {options} from "./Options";
import {Unit} from "./Unit";


export class BattleSceneUnitOverlay
{
  public activeUnit: Unit | null;
  public getSceneBounds: () => {width: number; height: number};

  private container: PIXI.Container;
  private renderer: PIXI.Renderer;

  private overlayContainer: PIXI.Container;

  private animationIsActive: boolean = false;
  private onAnimationFinish: () => void;


  constructor(container: PIXI.Container, renderer: PIXI.Renderer)
  {
    this.container = container;
    this.renderer = renderer;
    this.initLayers();
  }
  public destroy(): void
  {

  }
  public setVfx(vfxTemplate: BattleVfxTemplate, user: Unit, target: Unit): void
  {
    if (this.activeUnit)
    {
      const duration = vfxTemplate.duration * options.battle.animationTiming.effectDuration;
      if (this.activeUnit === user && vfxTemplate.userOverlay)
      {
        this.setOverlay(vfxTemplate.userOverlay, user, duration);
      }
      else if (this.activeUnit === target && vfxTemplate.enemyOverlay)
      {
        this.setOverlay(vfxTemplate.enemyOverlay, target, duration);
      }
      else
      {

      }
    }
    else
    {

    }
  }
  public clearOverlay(): void
  {
    this.animationIsActive = false;
    this.onAnimationFinish = null;

    this.activeUnit = null;
    this.overlayContainer.removeChildren();
  }

  private initLayers(): void
  {
    this.overlayContainer = new PIXI.Container();
    this.container.addChild(this.overlayContainer);
  }
  private setOverlay(overlayFN: (props: VfxParams) => void, unit: Unit, duration: number): void
  {
    this.clearOverlay();
    if (duration <= 0)
    {
      return;
    }
    if (this.animationIsActive)
    {
      console.warn("Triggered new unit overlay animation without clearing previous one");
    }

    this.activeUnit = unit;
    const vfxParams = this.getVfxParams(duration, this.addOverlay.bind(this), this.finishAnimation.bind(this));

    overlayFN(vfxParams);
  }
  private getVfxParams(
    duration: number,
    triggerStart: (container: PIXI.DisplayObject) => void,
    triggerEnd?: () => void,
  ): VfxParams
  {
    const bounds = this.getSceneBounds();

    return(
    {
      user: this.activeUnit,
      userOffset: {x: 0, y: 0},
      width: bounds.width,
      height: bounds.height,
      duration: duration,
      facingRight: this.activeUnit.battleStats.side === "side1",
      renderer: this.renderer,
      triggerStart: triggerStart,
      triggerEffect: () => {},
      triggerEnd: triggerEnd || (() => {}),
    });
  }
  private setContainerPosition(): void
  {
    const sceneBounds = this.getSceneBounds();
    const shouldLockToRight = this.activeUnit.battleStats.side === "side2";

    const containerBounds = this.overlayContainer.getLocalBounds();

    this.overlayContainer.y = sceneBounds.height - containerBounds.height;
    if (shouldLockToRight)
    {
      this.overlayContainer.x = sceneBounds.width - containerBounds.width;
    }
  }
  private addOverlay(overlay: PIXI.DisplayObject): void
  {
    this.animationIsActive = true;
    this.overlayContainer.addChild(overlay);
    this.setContainerPosition();
  }
  private finishAnimation(): void
  {
    if (this.onAnimationFinish)
    {
      this.onAnimationFinish();
    }

    this.clearOverlay();
  }
}
