/// <reference path="../lib/pixi.d.ts" />

import Point from "./Point";
import eventManager from "./eventManager";
import
{
  clamp,
} from "./utility";

export default class Camera
{
  public toCenterOn: Point;

  private container: PIXI.Container;
  private width: number;
  private height: number;
  private percentageCameraCanScrollOverEdge: number;
  // TODO 2017.07.30 | these are messed up
  private containerPositionBounds:
  {
    left: number,
    top: number,
    right: number,
    bottom: number,
  };
  private startPos: number[];
  private startClick: number[];
  private currZoom: number = 1;
  private screenWidth: number;
  private screenHeight: number;

  private readonly eventManagerListeners:
  {
    setCameraToCenterOn: (position: Point) => void;
  } =
  {
    setCameraToCenterOn: undefined,
  };
  private resizeListener: (e: UIEvent) => void;


  constructor(container: PIXI.Container, percentageCameraCanScrollOverEdge: number)
  {
    this.container = container;
    this.percentageCameraCanScrollOverEdge = percentageCameraCanScrollOverEdge;
    const screenElement = window.getComputedStyle(
      document.getElementById("pixi-container"), null);
    this.screenWidth = parseInt(screenElement.width);
    this.screenHeight = parseInt(screenElement.height);

    this.addEventListeners();
    this.setBounds();
  }

  public destroy()
  {
    for (let name in this.eventManagerListeners)
    {
      eventManager.removeEventListener(name, this.eventManagerListeners[name]);
    }

    window.removeEventListener("resize", this.resizeListener);
  }
  public startScroll(mousePos: number[])
  {
    this.setBounds();
    this.startClick = mousePos;
    this.startPos = [this.container.position.x, this.container.position.y];
  }
  public end()
  {
    this.startPos = undefined;
  }
  public move(currPos: number[]) // used for mouse scrolling
  {
    const delta = this.getDelta(currPos);
    this.container.position.x = this.startPos[0] + delta[0];
    this.container.position.y = this.startPos[1] + delta[1];
    this.clampEdges();

    this.onMove();
  }
  public deltaMove(delta: number[]) // used for keyboard scrolling
  {
    this.container.position.x += delta[0];
    this.container.position.y += delta[1];
    this.clampEdges();

    this.onMove();
  }
  public getCenterPosition(): Point
  {
    const localOrigin = this.getLocalPosition(this.container.position);

    return(
    {
      x: this.container.position.x + this.width / 2 - localOrigin.x,
      y: this.container.position.y + this.height / 2 - localOrigin.y,
    });
  }
  public centerOnPosition(pos: Point)
  {
    this.setBounds();

    const localPos = this.getLocalPosition(pos);
    const center = this.getScreenCenter();

    this.container.position.x += center.x - localPos.x;
    this.container.position.y += center.y - localPos.y;

    this.clampEdges();

    this.onMove();
  }

  public zoom(zoomAmount: number)
  {
    if (zoomAmount > 1)
    {
      // zoomAmount = 1;
    }

    const container = this.container;
    const oldZoom = this.currZoom;

    const zoomDelta = oldZoom - zoomAmount;
    const rect = container.getLocalBounds();

    // these 2 get position of screen center in relation to the container
    // 0: far left 1: far right
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

  public deltaZoom(delta: number, scale: number)
  {
    if (delta === 0)
    {
      return;
    }
    // const scaledDelta = absDelta + scale / absDelta;
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
  private addEventListeners()
  {
    this.resizeListener = (e: UIEvent) =>
    {
      const container = document.getElementById("pixi-container");
      if (!container)
      {
        throw new Error("Camera has no container element");
      }

      const style = window.getComputedStyle(container, null);
      this.screenWidth = parseInt(style.width);
      this.screenHeight = parseInt(style.height);
    };

    window.addEventListener("resize", this.resizeListener, false);

    this.eventManagerListeners.setCameraToCenterOn =
      eventManager.addEventListener("setCameraToCenterOn", (position: Point) =>
    {
      this.toCenterOn = position;
    });
  }
  private setBounds()
  {
    this.width = this.screenWidth;
    this.height = this.screenHeight;

    const rect = this.container.getLocalBounds();

    const min = 1 - this.percentageCameraCanScrollOverEdge;
    const max = this.percentageCameraCanScrollOverEdge;

    this.containerPositionBounds =
    {
      left: (this.width  * min) - rect.width * this.container.scale.x,
      right: (this.width  * max),
      top: (this.height * min) - rect.height * this.container.scale.y,
      bottom: (this.height * max),
    };
  }

  private onMove()
  {
    eventManager.dispatchEvent("cameraMoved", this.container.position.x, this.container.position.y);
  }
  private onZoom()
  {
    eventManager.dispatchEvent("cameraZoomed", this.currZoom);
  }
  private getDelta(currPos: number[])
  {
    const x = this.startClick[0] - currPos[0];
    const y = this.startClick[1] - currPos[1];

    return [-x, -y];
  }
  private clampEdges()
  {
    const x = clamp(
      this.container.position.x,
      this.containerPositionBounds.left,
      this.containerPositionBounds.right,
    );

    const y = clamp(
      this.container.position.y,
      this.containerPositionBounds.top,
      this.containerPositionBounds.bottom,
    );

    this.container.position.set(x, y);
  }
  private getScreenCenter()
  {
    return(
    {
      x: this.width / 2,
      y: this.height / 2,
    });
  }
  private getLocalPosition(position: Point): Point
  {
    const pos = <PIXI.Point> position;

    return this.container.worldTransform.apply(pos);
  }
}
