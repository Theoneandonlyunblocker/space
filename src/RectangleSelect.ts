/// <reference path="../lib/pixi.d.ts" />

import Point from "./Point";
import eventManager from "./eventManager";

export default class RectangleSelect
{
  public getSelectionTargetsFN: () => {position: Point; data: any}[];

  private graphics: PIXI.Graphics;
  private selecting: boolean;

  private startLocal: PIXI.Point;
  private currentGlobal: Point;

  private toSelectFrom: {position: Point; data: any}[];

  private readonly minimumSizeThreshhold = 5;
  private gfxContainer: PIXI.Container;
  private targetLayer: PIXI.Container;

  constructor(gfxContainer: PIXI.Container, targetLayer: PIXI.Container)
  {
    this.gfxContainer = gfxContainer;
    this.targetLayer = targetLayer;
    this.graphics = new PIXI.Graphics();
    gfxContainer.addChild(this.graphics);

    this.addEventListeners();
  }

  public destroy(): void
  {
    this.gfxContainer.removeChild(this.graphics);
    this.gfxContainer = null;
    this.graphics = null;
    this.toSelectFrom = null;
    this.getSelectionTargetsFN = null;
  }
  public startSelection(point: Point): void
  {
    this.selecting = true;
    this.startLocal = this.targetLayer.worldTransform.applyInverse(new PIXI.Point(point.x, point.y));
    this.currentGlobal = {x: point.x, y: point.y};

  }
  public moveSelection(point: Point): void
  {
    this.currentGlobal = {x: point.x, y: point.y};
    this.drawSelectionRectangle();
  }
  public endSelection(): void
  {
    const bounds = this.getBounds();
    if (bounds.width < this.minimumSizeThreshhold || bounds.height < this.minimumSizeThreshhold)
    {
      return;
    }

    this.setSelectionTargets();

    const inSelection = this.getAllInSelection();
    eventManager.dispatchEvent("selectFleets", inSelection);

    this.clearSelection();
  }
  public clearSelection(): void
  {
    this.selecting = false;
    this.graphics.clear();
    this.startLocal = null;
    this.currentGlobal = null;
  }
  public handleTargetLayerShift(): void
  {
    window.requestAnimationFrame(() =>
    {
      this.drawSelectionRectangle();
    });
  }

  private addEventListeners(): void
  {
    eventManager.dispatchEvent("setRectangleSelectTargetFN", this);
  }
  private drawSelectionRectangle(): void
  {
    if (!this.currentGlobal)
    {
      return;
    }

    const bounds = this.getBounds();

    this.graphics.clear();
    this.graphics.lineStyle(1, 0xFFFFFF, 1);
    this.graphics.beginFill(0x000000, 0);
    this.graphics.drawRect(bounds.left, bounds.top, bounds.width, bounds.height);
    this.graphics.endFill();
  }
  private setSelectionTargets(): void
  {
    if (!this.getSelectionTargetsFN)
    {
      return;
    }

    this.toSelectFrom = this.getSelectionTargetsFN();
  }
  private getBounds()
  {
    const startGlobal = this.targetLayer.worldTransform.apply(this.startLocal);
    const x1 = Math.round(Math.min(startGlobal.x, this.currentGlobal.x));
    const x2 = Math.round(Math.max(startGlobal.x, this.currentGlobal.x));
    const y1 = Math.round(Math.min(startGlobal.y, this.currentGlobal.y));
    const y2 = Math.round(Math.max(startGlobal.y, this.currentGlobal.y));

    return(
    {
      left: x1,
      top: y1,
      right: x2,
      bottom: y2,

      width: x2 - x1,
      height: y2 - y1,
    });
  }
  private getAllInSelection(): any[]
  {
    const toReturn: any[] = [];

    for (let i = 0; i < this.toSelectFrom.length; i++)
    {
      if (this.selectionContains(this.toSelectFrom[i].position))
      {
        toReturn.push(this.toSelectFrom[i].data);
      }
    }

    return toReturn;
  }
  private selectionContains(point: Point): boolean
  {
    const pixiPoint = new PIXI.Point(point.x, point.y);
    const transformedPoint = this.targetLayer.worldTransform.apply(pixiPoint);

    const x = transformedPoint.x;
    const y = transformedPoint.y;

    const bounds = this.getBounds();

    return(
      (x >= bounds.left && x <= bounds.right) &&
      (y >= bounds.top && y <= bounds.bottom)
    );
  }
}
