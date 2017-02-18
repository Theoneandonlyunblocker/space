/// <reference path="../lib/pixi.d.ts" />

import Point from "./Point";
import eventManager from "./eventManager";

let tempCameraId = 0;

export default class Camera
{
  tempCameraId: number;

  container: PIXI.Container;
  width: number;
  height: number;
  bounds: any = {};
  startPos: number[];
  startClick: number[];
  currZoom: number = 1;
  screenWidth: number;
  screenHeight: number;

  toCenterOn: Point; // point to center on once
                     // renderer view is mounted

  listeners:
  {
    [name: string]: any;
  } = {};

  resizeListener: any;

  /**
   * [constructor description]
   * @param {PIXI.Container} container [DOC the camera views and manipulates]
   * @param {number}                      bound     [How much of the container is allowed to leave the camera view.
   * 0.0 to 1.0]
   */
  constructor(container: PIXI.Container, bound: number)
  {
    this.tempCameraId = tempCameraId++;
    this.container = container;
    this.bounds.min = bound;
    // TODO 19.11.2016 | isn't 1 - bound good enough?
    this.bounds.max = Number((1 - bound).toFixed(1));
    const screenElement = window.getComputedStyle(
      document.getElementById("pixi-container"), null);
    this.screenWidth = parseInt(screenElement.width);
    this.screenHeight = parseInt(screenElement.height);

    this.addEventListeners();
    this.setBounds();
  }
  destroy()
  {
    for (let name in this.listeners)
    {
      eventManager.removeEventListener(name, this.listeners[name]);
    }

    window.removeEventListener("resize", this.resizeListener);
  }

  private addEventListeners()
  {
    const self = this;

    this.resizeListener = function(e: UIEvent)
    {
      const container = document.getElementById("pixi-container");
      if (!container) return;
      const style = window.getComputedStyle(container, null);
      self.screenWidth = parseInt(style.width);
      self.screenHeight = parseInt(style.height);
    };

    window.addEventListener("resize", this.resizeListener, false);

    this.listeners["setCameraToCenterOn"] =
      eventManager.addEventListener("setCameraToCenterOn", function(position: Point)
    {
      self.toCenterOn = position;
    });
  }

  private setBounds()
  {
    const rect = this.container.getLocalBounds();
    this.width = this.screenWidth;
    this.height = this.screenHeight;
    this.bounds =
    {
      xMin: (this.width  * this.bounds.min) - rect.width * this.container.scale.x,
      xMax: (this.width  * this.bounds.max),
      yMin: (this.height * this.bounds.min) - rect.height * this.container.scale.y,
      yMax: (this.height * this.bounds.max),
      min: this.bounds.min,
      max: this.bounds.max,
    };
  }

  startScroll(mousePos: number[])
  {
    this.setBounds();
    this.startClick = mousePos;
    this.startPos = [this.container.position.x, this.container.position.y];
  }
  end()
  {
    this.startPos = undefined;
  }
  private getDelta(currPos: number[])
  {
    const x = this.startClick[0] - currPos[0];
    const y = this.startClick[1] - currPos[1];
    return [-x, -y];
  }
  move(currPos: number[]) // used for mouse scrolling
  {
    const delta = this.getDelta(currPos);
    this.container.position.x = this.startPos[0] + delta[0];
    this.container.position.y = this.startPos[1] + delta[1];
    this.clampEdges();

    this.onMove();
  }
  deltaMove(delta: number[]) // used for keyboard scrolling
  {
    this.container.position.x += delta[0];
    this.container.position.y += delta[1];
    this.clampEdges();

    this.onMove();
  }
  private onMove()
  {
    eventManager.dispatchEvent("cameraMoved", this.container.position.x, this.container.position.y);
  }
  getScreenCenter()
  {
    return(
    {
      x: this.width / 2,
      y: this.height / 2,
    });
  }
  getLocalPosition(position: Point): Point
  {
    const pos = <PIXI.Point> position;
    return this.container.worldTransform.apply(pos);
  }
  getCenterPosition(): Point
  {
    const localOrigin = this.getLocalPosition(this.container.position);
    return(
    {
      x: this.container.position.x + this.width / 2 - localOrigin.x,
      y: this.container.position.y + this.height / 2 - localOrigin.y,
    });
  }
  centerOnPosition(pos: Point)
  {
    this.setBounds();

    const localPos = this.getLocalPosition(pos);
    const center = this.getScreenCenter();

    this.container.position.x += center.x - localPos.x;
    this.container.position.y += center.y - localPos.y;

    this.clampEdges();

    this.onMove();
  }

  zoom(zoomAmount: number)
  {
    if (zoomAmount > 1)
    {
      //zoomAmount = 1;
    }

    const container = this.container;
    const oldZoom = this.currZoom;

    const zoomDelta = oldZoom - zoomAmount;
    const rect = container.getLocalBounds();

    //these 2 get position of screen center in relation to the container
    //0: far left 1: far right
    const xRatio = 1 - ((container.x - this.screenWidth / 2) / rect.width / oldZoom + 1);
    const yRatio = 1 - ((container.y - this.screenHeight / 2) / rect.height / oldZoom + 1);

    const xDelta = rect.width * xRatio * zoomDelta;
    const yDelta = rect.height * yRatio * zoomDelta;
    container.position.x += xDelta;
    container.position.y += yDelta;
    container.scale.set(zoomAmount, zoomAmount);
    this.currZoom = zoomAmount;

    this.onMove();
    this.onZoom();
  }
  private onZoom()
  {
    eventManager.dispatchEvent("cameraZoomed", this.currZoom);
  }
  deltaZoom(delta: number, scale: number)
  {
    if (delta === 0)
    {
      return;
    }
    //const scaledDelta = absDelta + scale / absDelta;
    const direction = delta < 0 ? "out" : "in";
    const adjDelta = 1 + Math.abs(delta) * scale;
    if (direction === "out")
    {
      this.zoom(this.currZoom / adjDelta);
    }
    else
    {
      this.zoom(this.currZoom * adjDelta);
    }
  }

  private clampEdges()
  {
    let x = this.container.position.x;
    let y = this.container.position.y;

    //horizontal
    //left edge
    if (x < this.bounds.xMin)
    {
      x = this.bounds.xMin;
    }
    //right edge
    else if (x > this.bounds.xMax)
    {
      x = this.bounds.xMax;
    }

    //vertical
    //top
    if (y < this.bounds.yMin)
    {
      y = this.bounds.yMin;
    }
    //bottom
    else if (y > this.bounds.yMax)
    {
      y = this.bounds.yMax;
    }

    this.container.position.set(x, y);
  }
}
