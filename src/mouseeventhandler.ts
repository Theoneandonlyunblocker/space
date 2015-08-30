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
    rectangleSelect: RectangleSelect;

    startPoint: number[];
    currPoint: number[];

    currentAction: string;
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
      this.rectangleSelect = new RectangleSelect(renderer.layers["select"]);
      this.currentAction = undefined;

      window.oncontextmenu = function(event)
      {
        var eventTarget = <HTMLElement> event.target;
        if (eventTarget.localName !== "canvas") return;
        event.preventDefault();
        event.stopPropagation();
      };

      this.addEventListeners();
    }
    destroy()
    {
      for (var name in this.listeners)
      {
        eventManager.removeEventListener(name, this.listeners[name]);
      }

      this.hoveredStar = null;

      this.rectangleSelect.destroy();
      this.rectangleSelect = null;

      this.renderer = null;
      this.camera = null;
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

      this.listeners["touchStart"] = eventManager.addEventListener("touchStart", function(e)
      {
        self.touchStart(e.content, "world");
      });
      this.listeners["touchEnd"] = eventManager.addEventListener("touchEnd", function(e)
      {
        self.touchEnd(e.content, "world");
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

    touchStart(event, targetType: string)
    {
      if (targetType === "world")
      {
        if (app.playerControl.selectedFleets.length === 0)
        {
          this.startSelect(event);
        }
        else
        {
          this.startFleetMove(event);
        }
      }
      else
      {
        debugger;
      }
    }
    touchEnd(event, targetType: string)
    {
      if (targetType === "world")
      {
        if (this.currentAction === "select")
        {
          this.endSelect(event);
        }
        if (this.currentAction === "fleetMove")
        {
          this.completeFleetMove();
        }
      }
      else
      {
        debugger;
      }
    }

    mouseMove(event, targetType: string)
    {
      if (this.currentAction === "scroll")
      {
        this.scrollMove(event);
      }
      else if (this.currentAction === "zoom")
      {
        this.zoomMove(event);
      }
      else if (this.currentAction === "select")
      {
        this.dragSelect(event);
      }
    }
    mouseUp(event, targetType: string)
    {
      if (this.currentAction === undefined) return;

      if (this.currentAction === "scroll")
      {
        this.endScroll(event);
        this.preventGhost(15, "mouseUp");
      }
      else if (this.currentAction === "zoom")
      {
        this.endZoom(event);
        this.preventGhost(15, "mouseUp");
      }
      else if (this.currentAction === "select")
      {
        if (!this.preventingGhost["mouseUp"]) this.endSelect(event);
      }
      else if (this.currentAction === "fleetMove")
      {
        if (!this.preventingGhost["mouseUp"]) this.completeFleetMove();
      }
    }

    startScroll(event)
    {
      if (this.currentAction === "select") this.stashedAction = "select";
      this.currentAction = "scroll";
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
      this.currentAction = this.stashedAction;
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
      this.currentAction = this.stashedAction;
      this.stashedAction = undefined;
    }
    startZoom(event)
    {
      if (this.currentAction === "select") this.stashedAction = "select";
      this.currentAction = "zoom";
      this.startPoint = this.currPoint = [event.global.x, event.global.y];
    }
    setHoveredStar(star: Star)
    {
      this.hoveredStar = star;
      this.preventGhost(30, "hover");
      this.setFleetMoveTarget(star);
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
      this.currentAction = "fleetMove";
    }
    setFleetMoveTarget(star: Star)
    {
      if (this.currentAction !== "fleetMove") return;
      eventManager.dispatchEvent("setPotentialMoveTarget", star);
    }
    completeFleetMove()
    {
      if (this.hoveredStar)
      {
        eventManager.dispatchEvent("moveFleets", this.hoveredStar);
      }
      eventManager.dispatchEvent("endPotentialMove");
      this.currentAction = undefined;
    }
    clearFleetMoveTarget()
    {
      if (this.currentAction !== "fleetMove") return;
      eventManager.dispatchEvent("clearPotentialMoveTarget");
    }
    startSelect(event)
    {
      this.currentAction = "select";
      this.rectangleSelect.startSelection(event.getLocalPosition(this.renderer.layers["main"]));
    }
    dragSelect(event)
    {
      this.rectangleSelect.moveSelection(event.getLocalPosition(this.renderer.layers["main"]));
    }
    endSelect(event)
    {
      this.rectangleSelect.endSelection(event.getLocalPosition(this.renderer.layers["main"]));
      this.currentAction = undefined;
    }

  }
}
