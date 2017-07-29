/// <reference path="../lib/pixi.d.ts" />

import Point from "./Point";
import eventManager from "./eventManager";

export default class RectangleSelect
{
  parentContainer: PIXI.Container;
  graphics: PIXI.Graphics;
  selecting: boolean;

  start: Point;
  current: Point;

  toSelectFrom: {position: Point; data: any}[];
  getSelectionTargetsFN: () => {position: Point; data: any}[];

  constructor(parentContainer: PIXI.Container)
  {
    this.parentContainer = parentContainer;
    this.graphics = new PIXI.Graphics();
    parentContainer.addChild(this.graphics);

    this.addEventListeners();
  }
  destroy()
  {
    this.parentContainer = null;
    this.graphics = null;
    this.toSelectFrom = null;
    this.getSelectionTargetsFN = null;
  }
  addEventListeners()
  {
    eventManager.dispatchEvent("setRectangleSelectTargetFN", this);
  }

  startSelection(point: Point)
  {
    this.selecting = true;
    this.start = point;
    this.current = point;
  }
  moveSelection(point: Point)
  {
    this.current = point;
    this.drawSelectionRectangle();
  }
  endSelection(point: Point)
  {
    this.setSelectionTargets();

    const inSelection = this.getAllInSelection();
    eventManager.dispatchEvent("selectFleets", inSelection);

    this.clearSelection();
  }
  clearSelection()
  {
    this.selecting = false;
    this.graphics.clear();
    this.start = null;
    this.current = null;
  }

  drawSelectionRectangle()
  {
    if (!this.current) return;

    const gfx = this.graphics;
    const bounds = this.getBounds();

    gfx.clear();
    gfx.lineStyle(1, 0xFFFFFF, 1);
    gfx.beginFill(0x000000, 0);
    gfx.drawRect(bounds.x1, bounds.y1, bounds.width, bounds.height);
    gfx.endFill();
  }
  setSelectionTargets()
  {
    if (!this.getSelectionTargetsFN) return;

    this.toSelectFrom = this.getSelectionTargetsFN();
  }
  getBounds()
  {
    const x1 = Math.min(this.start.x, this.current.x);
    const x2 = Math.max(this.start.x, this.current.x);
    const y1 = Math.min(this.start.y, this.current.y);
    const y2 = Math.max(this.start.y, this.current.y);

    return(
    {
      x1: x1,
      x2: x2,
      y1: y1,
      y2: y2,

      width: x2 - x1,
      height: y2 - y1,
    });
  }

  getAllInSelection()
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

  selectionContains(point: Point)
  {
    const x = point.x;
    const y = point.y;

    const bounds = this.getBounds();

    return(
      (x >= bounds.x1 && x <= bounds.x2) &&
      (y >= bounds.y1 && y <= bounds.y2)
    );
  }
}
