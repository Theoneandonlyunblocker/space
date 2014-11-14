/// <reference path="camera.ts"/>

module Rance
{
  export class MouseEventHandler
  {
    camera: Camera;

    startPoint: number[];
    currPoint: number[];

    currAction: string;
    stashedAction: string;

    preventingGhost: boolean = false;

    constructor(camera: Camera)
    {
      var self = this;
      
      this.camera = camera;
      this.currAction = undefined;

      window.oncontextmenu = function(event)
      {
        var eventTarget = <HTMLElement> event.target;
        if (eventTarget.localName !== "canvas") return;
        event.preventDefault();
        event.stopPropagation();
      };

      var _canvas = document.getElementById("pixi-container");
      _canvas.addEventListener("DOMMouseScroll", function(e: any)
      {
        if (e.target.localName !== "canvas") return;
        self.camera.deltaZoom(-e.detail, 0.05);
      });
      _canvas.addEventListener("mousewheel", function(e: any)
      {
        if (e.target.localName !== "canvas") return;
        self.camera.deltaZoom(e.wheelDelta / 40, 0.05);
      });
      _canvas.addEventListener("mouseout", function(e: any)
      {
        if (e.target.localName !== "canvas") return;
      });
    }
    preventGhost(delay: number)
    {
      this.preventingGhost = true;
      var self = this;
      var timeout = window.setTimeout(function()
      {
        self.preventingGhost = false;
        window.clearTimeout(timeout);
      }, delay);
    }
    mouseDown(event, targetType: string)
    {
      if (
          event.originalEvent.ctrlKey ||
          event.originalEvent.metaKey ||
          event.originalEvent.button === 1 ||
          event.originalEvent.button === 2
        )
      {
        this.startScroll(event);
      }
    }

    mouseMove(event, targetType: string)
    {
      if (targetType === "stage")
      {
        if (this.currAction === "zoom" || this.currAction === "scroll")
        {
          this.stageMove(event);
        }
      }
      else
      {
        if (this.currAction === undefined)
        {
          this.hover(event);
        }
      }
    }
    mouseUp(event, targetType: string)
    {
      if (this.currAction === undefined) return;

      else if (targetType === "stage" &&
        (this.currAction === "zoom" || this.currAction === "scroll"))
      {
        this.stageEnd(event);
        this.preventGhost(15);
      }
    }

    startScroll(event)
    {
      if (this.currAction === "cellAction") this.stashedAction = "cellAction";
      this.currAction = "scroll";
      this.startPoint = [event.global.x, event.global.y];
      this.camera.startScroll(this.startPoint);
    }
    startZoom(event)
    {
      if (this.currAction === "cellAction") this.stashedAction = "cellAction";
      this.currAction = "zoom";
      this.startPoint = this.currPoint = [event.global.x, event.global.y];
    }

    stageMove(event)
    {
      if (this.currAction === "scroll")
      {
        this.camera.move([event.global.x, event.global.y]);
      }
      else if (this.currAction === "zoom")
      {
        var delta = event.global.x + this.currPoint[1] -
          this.currPoint[0] - event.global.y;
        this.camera.deltaZoom(delta, 0.005);
        this.currPoint = [event.global.x, event.global.y];
      }
    }
    stageEnd(event)
    {
      if (this.currAction === "scroll")
      {
        this.camera.end();
        this.startPoint = undefined;
        this.currAction = this.stashedAction;
        this.stashedAction = undefined;
      }
      if (this.currAction === "zoom")
      {
        this.startPoint = undefined;
        this.currAction = this.stashedAction;
        this.stashedAction = undefined;
      }
    }
    hover(event)
    {

    }

  }
}
