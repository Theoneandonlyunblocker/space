/// <reference path="fleet.ts"/>
/// <reference path="camera.ts"/>
/// <reference path="renderer.ts"/>
/// <reference path="rectangleselect.ts"/>

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

    this.listeners["mouseDown"] = eventManager.addEventListener("mouseDown",
      function(e: PIXI.interaction.InteractionEvent, star?: Star)
      {
        self.mouseDown(e, star);
      });
    this.listeners["mouseUp"] = eventManager.addEventListener("mouseUp",
      function(e: PIXI.interaction.InteractionEvent)
      {
        self.mouseUp(e);
      });

    this.listeners["touchStart"] = eventManager.addEventListener("touchStart",
      function(e: PIXI.interaction.InteractionEvent)
      {
        self.touchStart(e);
      });
    this.listeners["touchEnd"] = eventManager.addEventListener("touchEnd",
      function(e: PIXI.interaction.InteractionEvent)
      {
        self.touchEnd(e);
      });

    this.listeners["hoverStar"] = eventManager.addEventListener("hoverStar",
      function(star: Star)
      {
        self.setHoveredStar(star);
      });
    this.listeners["clearHover"] = eventManager.addEventListener("clearHover",
      function()
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
  makeUITransparent()
  {
    if (!this.currentAction) return;
    var ui = <HTMLElement> document.getElementsByClassName("galaxy-map-ui")[0];
    if (ui) 
    {
      ui.classList.add("prevent-pointer-events", "mouse-event-active-ui");
    }
  }
  makeUIOpaque()
  {
    if (this.currentAction) return;
    var ui = <HTMLElement> document.getElementsByClassName("galaxy-map-ui")[0];
    if (ui) 
    {
      ui.classList.remove("prevent-pointer-events", "mouse-event-active-ui");
    }
  }
  cancelCurrentAction()
  {
    switch (this.currentAction)
    {
      case "select": // other events handle fine without explicitly canceling
      {
        this.rectangleSelect.clearSelection();
        this.currentAction = undefined;
        this.makeUIOpaque();
      }
    }
  }
  mouseDown(event: PIXI.interaction.InteractionEvent, star?: Star)
  {
    if (this.preventingGhost["mouseDown"]) return;

    var originalEvent = <MouseEvent> event.data.originalEvent;
    if (
        originalEvent.ctrlKey ||
        originalEvent.metaKey ||
        originalEvent.button === 1
      )
    {
      this.startScroll(event);
    }
    else if (originalEvent.button === 0 ||
      !isFinite(originalEvent.button))
    {
      this.cancelCurrentAction();
      this.startSelect(event);
    }
    else if (originalEvent.button === 2)
    {
      this.cancelCurrentAction();
      this.startFleetMove(event, star);
    }

    this.preventGhost(15, "mouseDown");
  }

  touchStart(event: PIXI.interaction.InteractionEvent, star?: Star)
  {
    if (app.playerControl.selectedFleets.length === 0)
    {
      this.startSelect(event);
    }
    else
    {
      this.startFleetMove(event, star);
    }
  }
  touchEnd(event: PIXI.interaction.InteractionEvent)
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

  mouseMove(event: PIXI.interaction.InteractionEvent)
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
  mouseUp(event: PIXI.interaction.InteractionEvent)
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

  startScroll(event: PIXI.interaction.InteractionEvent)
  {
    if (this.currentAction !== "scroll")
    {
      this.stashedAction = this.currentAction;
    }
    this.currentAction = "scroll";
    this.startPoint = [event.data.global.x, event.data.global.y];
    this.camera.startScroll(this.startPoint);
    this.makeUITransparent();
  }
  scrollMove(event: PIXI.interaction.InteractionEvent)
  {
    this.camera.move([event.data.global.x, event.data.global.y]);
  }
  endScroll(event: PIXI.interaction.InteractionEvent)
  {
    this.camera.end();
    this.startPoint = undefined;
    this.currentAction = this.stashedAction;
    this.stashedAction = undefined;
    this.makeUIOpaque();
  }
  zoomMove(event: PIXI.interaction.InteractionEvent)
  {
    var delta = event.data.global.x + this.currPoint[1] -
      this.currPoint[0] - event.data.global.y;
    this.camera.deltaZoom(delta, 0.005);
    this.currPoint = [event.data.global.x, event.data.global.y];
  }
  endZoom(event: PIXI.interaction.InteractionEvent)
  {
    this.startPoint = undefined;
    this.currentAction = this.stashedAction;
    this.stashedAction = undefined;
  }
  startZoom(event: PIXI.interaction.InteractionEvent)
  {
    if (this.currentAction !== "zoom")
    {
      this.stashedAction = this.currentAction;
    }
    this.currentAction = "zoom";
    this.startPoint = this.currPoint = [event.data.global.x, event.data.global.y];
  }
  setHoveredStar(star: Star)
  {
    this.preventGhost(30, "hover");
    if (star !== this.hoveredStar)
    {
      this.hoveredStar = star;
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
  startFleetMove(event: PIXI.interaction.InteractionEvent, star: Star)
  {
    eventManager.dispatchEvent("startPotentialMove", star);
    this.currentAction = "fleetMove";
    this.makeUITransparent();
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
    this.makeUIOpaque();
  }
  clearFleetMoveTarget()
  {
    if (this.currentAction !== "fleetMove") return;
    eventManager.dispatchEvent("clearPotentialMoveTarget");
  }
  startSelect(event: PIXI.interaction.InteractionEvent)
  {
    this.currentAction = "select";
    this.rectangleSelect.startSelection(event.data.getLocalPosition(this.renderer.layers["main"]));
    this.makeUITransparent();
  }
  dragSelect(event: PIXI.interaction.InteractionEvent)
  {
    this.rectangleSelect.moveSelection(event.data.getLocalPosition(this.renderer.layers["main"]));
  }
  endSelect(event: PIXI.interaction.InteractionEvent)
  {
    this.rectangleSelect.endSelection(event.data.getLocalPosition(this.renderer.layers["main"]));
    this.currentAction = undefined;
    this.makeUIOpaque();
  }

}
