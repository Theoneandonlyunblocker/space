/// <reference path="../lib/pixi.d.ts" />

import BattleSFXTemplate from "./templateinterfaces/BattleSFXTemplate";
import SFXParams from "./templateinterfaces/SFXParams";

import Unit from "./Unit";
import Options from "./options";

export default class BattleSceneUnitOverlay
{
  container: PIXI.Container;
  renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;

  overlayContainer: PIXI.Container;

  activeUnit: Unit;
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
    this.overlayContainer = new PIXI.Container;
    this.container.addChild(this.overlayContainer);
  }
  setSFX(SFXTemplate: BattleSFXTemplate, user: Unit, target: Unit)
  {
    if (this.activeUnit)
    {
      var duration = SFXTemplate.duration * Options.battleAnimationTiming.effectDuration;
      if (this.activeUnit === user && SFXTemplate.userOverlay)
      {
        this.setOverlay(SFXTemplate.userOverlay, user, duration);
      }
      else if (this.activeUnit === target && SFXTemplate.enemyOverlay)
      {
        this.setOverlay(SFXTemplate.enemyOverlay, target, duration);
      }
      else
      {

      }
    }
    else
    {

    }
  }
  setOverlay(overlayFN: (props: SFXParams) => void, unit: Unit, duration: number)
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
    var SFXParams = this.getSFXParams(duration, this.addOverlay.bind(this), this.finishAnimation.bind(this));

    overlayFN(SFXParams);
  }
  clearOverlay()
  {
    this.animationIsActive = false;
    this.onAnimationFinish = null;

    this.activeUnit = null;
    this.overlayContainer.removeChildren();
  }
  private getSFXParams(duration: number,
    triggerStart: (container: PIXI.DisplayObject) => void,
    triggerEnd?: () => void): SFXParams
  {
    var bounds = this.getSceneBounds();

    return(
    {
      user: this.activeUnit,
      width: bounds.width,
      height: bounds.height,
      duration: duration,
      facingRight: this.activeUnit.battleStats.side === "side1",
      renderer: this.renderer,
      triggerStart: triggerStart,
      triggerEnd: triggerEnd
    });
  }
  private setContainerPosition()
  {
    var sceneBounds = this.getSceneBounds();
    var shouldLockToRight = this.activeUnit.battleStats.side === "side2";

    var containerBounds = this.overlayContainer.getLocalBounds();

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
