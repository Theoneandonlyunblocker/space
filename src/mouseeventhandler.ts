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

    hoveredStar: Star;

    preventingGhost:
    {
      [type: string]: any;
    } = {};

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

      this.listeners["hoverStar"] = eventManager.addEventListener("hoverStar", function(e)
      {
        self.setHoveredStar(e.content);
      });
      this.listeners["clearHover"] = eventManager.addEventListener("clearHover", function(e)
      {
        self.clearHoveredStar();
      });
    }
    destroy()
    {
      for (var name in this.listeners)
      {
        eventManager.removeEventListener(name, this.listeners[name]);
      }
    }
    preventGhost(delay: number, type: string)
    {
      if (this.preventingGhost[type])
      {
        window.clearTimeout(this.preventingGhost[type]);
      }

      var self = this;

      this.preventingGhost[type] = window.setTimeout(function()
      {
        self.preventingGhost[type] = null
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
        if (event.originalEvent.button === 0 ||
          !isFinite(event.originalEvent.button))
        {
          this.startSelect(event);
        }
        else if (event.originalEvent.button === 2)
        {
          this.startFleetMove(event);
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
          this.preventGhost(15, "mouseUp");
        }
        else if (this.currAction === "zoom")
        {
          this.endZoom(event);
          this.preventGhost(15, "mouseUp");
        }
      }
      else
      {
        if (this.currAction === "select")
        {
          if (!this.preventingGhost["mouseUp"]) this.endSelect(event);
        }
        if (this.currAction === "fleetMove")
        {
          if (!this.preventingGhost["mouseUp"]) this.completeFleetMove();
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
    setHoveredStar(star: Star)
    {
      var sameAsOld = this.hoveredStar === star;
      this.hoveredStar = star;
      this.preventGhost(30, "hover");
      if (!sameAsOld)
      {
        this.setFleetMoveTarget(star);
      }
    }

    clearHoveredStar()
    {
      var timeout = window.setTimeout(function()
      {
        if (!this.preventingGhost["hover"])
        {
          this.hoveredStar = null;
          this.clearFleetMoveTarget();
        }
        window.clearTimeout(timeout);
      }.bind(this), 15);
    }

    startFleetMove(event)
    {
      eventManager.dispatchEvent("startPotentialMove", event.target.star);
      this.currAction = "fleetMove";
    }
    setFleetMoveTarget(star: Star)
    {
      if (this.currAction !== "fleetMove") return;
      eventManager.dispatchEvent("setPotentialMoveTarget", star);
    }
    completeFleetMove()
    {
      eventManager.dispatchEvent("endPotentialMove");
      this.currAction = undefined;
    }
    clearFleetMoveTarget()
    {
      if (this.currAction !== "fleetMove") return;
      eventManager.dispatchEvent("clearPotentialMoveTarget");
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
