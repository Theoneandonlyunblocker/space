/// <reference path="../lib/pixi.d.ts" />

import BattleSfxTemplate from "./templateinterfaces/BattleSfxTemplate";
import SfxParams from "./templateinterfaces/SfxParams";

import Options from "./Options";
import Unit from "./Unit";


export default class BattleSceneUnitOverlay
{
  container: PIXI.Container;
  renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;

  overlayContainer: PIXI.Container;

  activeUnit: Unit | null;
  getSceneBounds: () => {width: number; height: number};

  animationIsActive: boolean = false;
  onAnimationFinish: () => void;


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
    this.overlayContainer = new PIXI.Container();
    this.container.addChild(this.overlayContainer);
  }
  setSfx(sfxTemplate: BattleSfxTemplate, user: Unit, target: Unit)
  {
    if (this.activeUnit)
    {
      const duration = sfxTemplate.duration * Options.battleAnimationTiming.effectDuration;
      if (this.activeUnit === user && sfxTemplate.userOverlay)
      {
        this.setOverlay(sfxTemplate.userOverlay, user, duration);
      }
      else if (this.activeUnit === target && sfxTemplate.enemyOverlay)
      {
        this.setOverlay(sfxTemplate.enemyOverlay, target, duration);
      }
      else
      {

      }
    }
    else
    {

    }
  }
  setOverlay(overlayFN: (props: SfxParams) => void, unit: Unit, duration: number)
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
    const sfxParams = this.getSfxParams(duration, this.addOverlay.bind(this), this.finishAnimation.bind(this));

    overlayFN(sfxParams);
  }
  clearOverlay()
  {
    this.animationIsActive = false;
    this.onAnimationFinish = null;

    this.activeUnit = null;
    this.overlayContainer.removeChildren();
  }
  private getSfxParams(
    duration: number,
    triggerStart: (container: PIXI.DisplayObject) => void,
    triggerEnd?: () => void,
  ): SfxParams
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
