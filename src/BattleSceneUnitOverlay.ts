import * as PIXI from "pixi.js";

import {BattleVfxTemplate} from "./templateinterfaces/BattleVfxTemplate";
import {VfxParams} from "./templateinterfaces/VfxParams";

import {options} from "./Options";
import {Unit} from "./Unit";


export class BattleSceneUnitOverlay
{
  container: PIXI.Container;
  renderer: PIXI.Renderer;

  overlayContainer: PIXI.Container;

  activeUnit: Unit | null;
  getSceneBounds: () => {width: number; height: number};

  animationIsActive: boolean = false;
  onAnimationFinish: () => void;


  constructor(container: PIXI.Container, renderer: PIXI.Renderer)
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
    this.overlayContainer = new PIXI.Container();
    this.container.addChild(this.overlayContainer);
  }
  setVfx(vfxTemplate: BattleVfxTemplate, user: Unit, target: Unit)
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
  setOverlay(overlayFN: (props: VfxParams) => void, unit: Unit, duration: number)
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
  clearOverlay()
  {
    this.animationIsActive = false;
    this.onAnimationFinish = null;

    this.activeUnit = null;
    this.overlayContainer.removeChildren();
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
  private setContainerPosition()
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
  private addOverlay(overlay: PIXI.DisplayObject)
  {
    this.animationIsActive = true;
    this.overlayContainer.addChild(overlay);
    this.setContainerPosition();
  }
  private finishAnimation()
  {
    if (this.onAnimationFinish)
    {
      this.onAnimationFinish();
    }

    this.clearOverlay();
  }
}
