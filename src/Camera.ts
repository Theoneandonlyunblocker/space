import * as PIXI from "pixi.js";

import Point from "./Point";
import {registerActiveCamera} from "./centerCameraOnPosition";
import eventManager from "./eventManager";
import
{
  clamp,
} from "./utility";


export default class Camera
{
  public getBoundsObjectBoundsFN: () => PIXI.Rectangle;

  private container: PIXI.Container;
  private width: number;
  private height: number;
  private scrollPosition: Point;

  constructor(container: PIXI.Container)
  {
    this.container = container;

    this.setSize = this.setSize.bind(this);
    this.setSize();

    this.addEventListeners();
    registerActiveCamera(this);
  }

  public destroy(): void
  {
    registerActiveCamera(null);
    this.removeEventListeners();

    this.getBoundsObjectBoundsFN = null;
  }
  public move(x: number, y: number): void
  {
    this.container.pivot.set(x, y);

    this.clampEdges();
    this.onMove();
  }
  public deltaMove(deltaX: number, deltaY: number): void
  {
    this.move(
      this.container.pivot.x + deltaX,
      this.container.pivot.y + deltaY,
    );
  }
  public startScroll(position: Point): void
  {
    this.scrollPosition = {x: position.x, y: position.y};
  }
  public scrollMove(position: Point): void
  {
    this.deltaMove(
      (this.scrollPosition.x - position.x) / this.container.scale.x,
      (this.scrollPosition.y - position.y) / this.container.scale.y,
    );

    this.scrollPosition = {x: position.x, y: position.y};
  }
  public zoom(zoomAmount: number)
  {
    this.container.scale.set(zoomAmount, zoomAmount);

    this.onMove();
    this.onZoom();
  }
  public deltaZoom(delta: number, scale: number)
  {
    if (delta === 0)
    {
      return;
    }
    // const scaledDelta = absDelta + scale / absDelta;
    const direction = delta < 0 ? "in" : "out";
    const adjDelta = 1 + Math.abs(delta) * scale;
    if (direction === "out")
    {
      this.zoom(this.container.scale.x / adjDelta);
    }
    else
    {
      this.zoom(this.container.scale.x * adjDelta);
    }
  }
  public getCenterPosition(): Point
  {
    return {x: this.container.pivot.x, y: this.container.pivot.y};
  }
  public centerOnPosition(x: number, y: number): void
  {
    this.container.pivot.set(x, y);
  }

  private addEventListeners()
  {
    window.addEventListener("resize", this.setSize);
  }
  private removeEventListeners()
  {
    window.removeEventListener("resize", this.setSize);
  }
  private onMove()
  {
    eventManager.dispatchEvent("cameraMoved", this.container.position.x, this.container.position.y);
  }
  private onZoom()
  {
    eventManager.dispatchEvent("cameraZoomed", this.container.scale.x);
  }
  private setSize(): void
  {
    const container = document.getElementById("pixi-container");
    if (!container)
    {
      throw new Error("Camera has no container element");
    }

    const style = window.getComputedStyle(container);
    this.width = parseInt(style.width!);
    this.height = parseInt(style.height!);

    this.container.position.set(
      this.width / 2,
      this.height / 2,
    );
  }
  private clampEdges(): void
  {
    const bounds = this.getBoundsObjectBoundsFN();

    this.container.pivot.x = clamp(
      this.container.pivot.x,
      bounds.x,
      bounds.x + bounds.width,
    );

    this.container.pivot.y = clamp(
      this.container.pivot.y,
      bounds.y,
      bounds.y + bounds.height,
    );
  }
}
