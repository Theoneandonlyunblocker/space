/// <reference path="../lib/pixi.d.ts" />

module Rance
{
  /**
   * @class Camera
   * @constructor
   */
  export class Camera
  {
    container: PIXI.DisplayObjectContainer;
    width: number
    height: number
    bounds: any = {};
    startPos: number[];
    startClick: number[];
    currZoom: number = 1;
    screenWidth: number;
    screenHeight: number;

    onMove: (x: number, y: number) => void;
    onZoom: (zoom: number) => void;

    /**
     * [constructor description]
     * @param {PIXI.DisplayObjectContainer} container [DOC the camera views and manipulates]
     * @param {number}                      bound     [How much of the container is allowed to leave the camera view.
     * 0.0 to 1.0]
     */
    constructor( container:PIXI.DisplayObjectContainer, bound: number)
    {
      this.container = container;
      this.bounds.min = bound;
      this.bounds.max = Number( (1 - bound).toFixed(1) );
      var screenElement = window.getComputedStyle(
        document.getElementById("pixi-container"), null );
      this.screenWidth = parseInt(screenElement.width);
      this.screenHeight = parseInt(screenElement.height);

      this.addEventListeners();
      this.setBounds();
    }

    /**
     * @method addEventListeners
     * @private
     */
    private addEventListeners()
    {
      var self = this;

      window.addEventListener("resize", function(e)
      {
        var container = document.getElementById("pixi-container");
        if (!container) return;
        var style = window.getComputedStyle(container, null);
        self.screenWidth = parseInt(style.width);
        self.screenHeight = parseInt(style.height);
      }, false);
    }

    /**
     * @method setBound
     * @private
     */
    private setBounds()
    {
      var rect = this.container.getLocalBounds();
      this.width = this.screenWidth;
      this.height = this.screenHeight;
      this.bounds =
      {
        xMin: (this.width  * this.bounds.min) - rect.width * this.container.scale.x,
        xMax: (this.width  * this.bounds.max),
        yMin: (this.height * this.bounds.min) - rect.height * this.container.scale.y,
        yMax: (this.height * this.bounds.max),
        min: this.bounds.min,
        max: this.bounds.max
      }
    }
    /**
     * @method startScroll
     * @param {number[]} mousePos [description]
     */
    startScroll( mousePos: number[] )
    {
      this.setBounds();
      this.startClick = mousePos;
      this.startPos = [this.container.position.x, this.container.position.y];

      var ui = <HTMLElement> document.getElementsByClassName("galaxy-map-ui")[0];
      if (ui) ui.classList.add("prevent-pointer-events");
    }
    /**
     * @method end
     */
    end()
    {
      this.startPos = undefined;

      var ui = <HTMLElement> document.getElementsByClassName("galaxy-map-ui")[0];
      if (ui) ui.classList.remove("prevent-pointer-events");
    }
    /**
     * @method getDelta
     * @param {number[]} currPos [description]
     */
    private getDelta( currPos: number[] )
    {
      var x = this.startClick[0] - currPos[0];
      var y = this.startClick[1] - currPos[1];
      return [-x, -y];
    }
    /**
     * @method move
     * @param {number[]} currPos [description]
     */
    move( currPos: number[] )
    {
      var delta = this.getDelta(currPos);
      this.container.position.x = this.startPos[0] + delta[0];
      this.container.position.y = this.startPos[1] + delta[1];
      this.clampEdges();

      if (this.onMove)
      {
        this.onMove(this.container.position.x, this.container.position.y);
      }
    }
    getScreenCenter()
    {
      return(
      {
        x: this.width / 2,
        y: this.height / 2
      });
    }
    centerOnPosition(pos: Point)
    {
      var wt = this.container.worldTransform;

      var localPos = wt.apply(pos);
      var center = this.getScreenCenter();

      this.container.position.x += center.x - localPos.x;
      this.container.position.y += center.y - localPos.y;

      this.clampEdges();

      if (this.onMove)
      {
        this.onMove(this.container.position.x, this.container.position.y);
      }
    }

    /**
     * @method zoom
     * @param {number} zoomAmount [description]
     */
    zoom( zoomAmount: number)
    {
      if (zoomAmount > 1)
      {
        //zoomAmount = 1;
      }

      var container = this.container;
      var oldZoom = this.currZoom;

      var zoomDelta = oldZoom - zoomAmount;
      var rect = container.getLocalBounds();

      //these 2 get position of screen center in relation to the container
      //0: far left 1: far right
      var xRatio = 1 - ((container.x - this.screenWidth / 2) / rect.width / oldZoom + 1);
      var yRatio = 1 - ((container.y - this.screenHeight / 2) / rect.height / oldZoom + 1);

      var xDelta = rect.width * xRatio * zoomDelta;
      var yDelta = rect.height * yRatio * zoomDelta;
      container.position.x += xDelta;
      container.position.y += yDelta;
      container.scale.set(zoomAmount, zoomAmount);
      this.currZoom = zoomAmount;

      if (this.onMove)
      {
        this.onMove(this.container.position.x, this.container.position.y);
      }
      if (this.onZoom)
      {
        this.onZoom(this.currZoom);
      }
    }
    /**
     * @method deltaZoom
     * @param {number} delta [description]
     * @param {number} scale [description]
     */
    deltaZoom( delta: number, scale: number )
    {
      if (delta === 0)
      {
        return;
      }
      //var scaledDelta = absDelta + scale / absDelta;
      var direction = delta < 0 ? "out" : "in";
      var adjDelta = 1 + Math.abs(delta) * scale
      if (direction === "out")
      {
        this.zoom(this.currZoom / adjDelta);
      }
      else
      {
        this.zoom(this.currZoom * adjDelta);
      }
    }
    /**
     * @method clampEdges
     * @private
     */
    private clampEdges()
    {
      var x = this.container.position.x;
      var y = this.container.position.y;

      //horizontal
      //left edge
      if ( x < this.bounds.xMin)
      {
        x = this.bounds.xMin;
      }
      //right edge
      else if ( x > this.bounds.xMax)
      {
        x = this.bounds.xMax;
      }

      //vertical
      //top
      if ( y < this.bounds.yMin )
      {
        y = this.bounds.yMin;
      }
      //bottom
      else if ( y > this.bounds.yMax )
      {
        y = this.bounds.yMax;
      }

      this.container.position.set(x, y)
    }
  }
}
