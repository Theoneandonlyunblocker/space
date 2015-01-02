/// <reference path="fleet.ts"/>
/// <reference path="camera.ts"/>
/// <reference path="renderer.ts"/>
/// <reference path="rectangleselect.ts"/>

module Rance
{
  export class MouseEventHandler
  {
    renderer: Renderer;
    camera: Camera;
    rectangleselect: RectangleSelect;

    startPoint: number[];
    currPoint: number[];

    currAction: string;
    stashedAction: string;

    preventingGhost: boolean = false;
    listeners:
    {
      [name: string]: any;
    } = {};

    constructor(renderer: Renderer, camera: Camera)
    {
      this.renderer = renderer;
      this.camera = camera;
      this.rectangleselect = new RectangleSelect(renderer.layers["select"]);
      this.currAction = undefined;

      window.oncontextmenu = function(event)
      {
        var eventTarget = <HTMLElement> event.target;
        if (eventTarget.localName !== "canvas") return;
        event.preventDefault();
        event.stopPropagation();
      };

      this.addEventListeners();
    }
    addEventListeners()
    {
      var self = this;

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

      this.listeners["mouseDown"] = eventManager.addEventListener("mouseDown", function(e)
      {
        self.mouseDown(e.content, "world");
      });
      this.listeners["mouseUp"] = eventManager.addEventListener("mouseUp", function(e)
      {
        self.mouseUp(e.content, "world");
      });
    }
    destroy()
    {
      for (var name in this.listeners)
      {
        eventManager.removeEventListener(name, this.listeners[name]);
      }
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
      if (targetType === "stage")
      {
        if (
            event.originalEvent.ctrlKey ||
            event.originalEvent.metaKey ||
            event.originalEvent.button === 1 //||
            //event.originalEvent.button === 2
          )
        {
          this.startScroll(event);
        }
      }
      else if (targetType === "world")
      {
        if (event.originalEvent.button === 0)
        {
          this.startSelect(event);
        }
      }
    }

    mouseMove(event, targetType: string)
    {
      if (targetType === "stage")
      {
        if (this.currAction === "scroll")
        {
          this.scrollMove(event);
        }
        else if (this.currAction === "zoom")
        {
          this.zoomMove(event);
        }
      }
      else
      {
        if (this.currAction === "select")
        {
          this.dragSelect(event);
        }
      }
    }
    mouseUp(event, targetType: string)
    {
      if (this.currAction === undefined) return;

      if (targetType === "stage")
      {
        if (this.currAction === "scroll")
        {
          this.endScroll(event);
          this.preventGhost(15);
        }
        else if (this.currAction === "zoom")
        {
          this.endZoom(event);
          this.preventGhost(15);
        }
      }
      else
      {
        if (this.currAction === "select")
        {
          if (!this.preventingGhost) this.endSelect(event);
        }
      }
    }

    startScroll(event)
    {
      if (this.currAction === "select") this.stashedAction = "select";
      this.currAction = "scroll";
      this.startPoint = [event.global.x, event.global.y];
      this.camera.startScroll(this.startPoint);
    }
    scrollMove(event)
    {
      this.camera.move([event.global.x, event.global.y]);
    }
    endScroll(event)
    {
      this.camera.end();
      this.startPoint = undefined;
      this.currAction = this.stashedAction;
      this.stashedAction = undefined;
    }
    zoomMove(event)
    {
      var delta = event.global.x + this.currPoint[1] -
        this.currPoint[0] - event.global.y;
      this.camera.deltaZoom(delta, 0.005);
      this.currPoint = [event.global.x, event.global.y];
    }
    endZoom(event)
    {
      this.startPoint = undefined;
      this.currAction = this.stashedAction;
      this.stashedAction = undefined;
    }
    startZoom(event)
    {
      if (this.currAction === "select") this.stashedAction = "select";
      this.currAction = "zoom";
      this.startPoint = this.currPoint = [event.global.x, event.global.y];
    }
    startSelect(event)
    {
      this.currAction = "select";
      this.rectangleselect.startSelection(event.getLocalPosition(this.renderer.layers["main"]));
    }
    dragSelect(event)
    {
      this.rectangleselect.moveSelection(event.getLocalPosition(this.renderer.layers["main"]));
    }
    endSelect(event)
    {
      this.rectangleselect.endSelection(event.getLocalPosition(this.renderer.layers["main"]));
      this.currAction = undefined;
    }
    hover(event)
    {

    }

  }
}
