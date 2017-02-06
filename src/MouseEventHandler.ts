
import app from "./App"; // TODO global
import Renderer from "./Renderer";
import Camera from "./Camera";
import Star from "./Star";
import RectangleSelect from "./RectangleSelect";
import eventManager from "./eventManager";

type Action =
  "select" |
  "fleetMove" |
  "scroll" |
  "zoom";

export default class MouseEventHandler
{
  renderer: Renderer;
  camera: Camera;
  rectangleSelect: RectangleSelect;

  startPoint: number[];
  currPoint: number[];

  currentAction: Action;
  stashedAction: Action;

  hoveredStar: Star;

  preventingGhost:
  {
    [type: string]: number; // number = timeout handle
  } = {};

  listeners:
  {
    [name: string]: Function;
  } = {};

  constructor(renderer: Renderer, camera: Camera)
  {
    this.renderer = renderer;
    this.camera = camera;
    this.rectangleSelect = new RectangleSelect(renderer.layers.select);
    this.currentAction = undefined;

    this.addEventListeners();
  }
  public destroy(): void
  {
    for (let name in this.listeners)
    {
      eventManager.removeEventListener(name, this.listeners[name]);
    }

    this.hoveredStar = null;

    this.rectangleSelect.destroy();
    this.rectangleSelect = null;

    this.renderer = null;
    this.camera = null;
  }

  public mouseMove(event: PIXI.interaction.InteractionEvent): void
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
  public mouseUp(event: PIXI.interaction.InteractionEvent): void
  {
    switch (this.currentAction)
    {
      case undefined:
      {
        break;
      }
      case "scroll":
      {
        this.endScroll(event);
        this.preventGhost(15, "mouseUp");
        break;
      }
      case "select":
      {
        if (!this.preventingGhost["mouseUp"])
        {
          this.endSelect(event);
        }
        break;
      }
      case "fleetMove":
      {
        if (!this.preventingGhost["mouseUp"])
        {
          this.completeFleetMove();
        }
        break;

      }
      // case "zoom":
      // {
      //   this.endZoom(event);
      //   this.preventGhost(15, "mouseUp");
      //   break;
      // }
    }
  }
  public mouseDown(event: PIXI.interaction.InteractionEvent, star?: Star): void
  {
    if (this.preventingGhost["mouseDown"])
    {
      return;
    }

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

  private addEventListeners(): void
  {
    const pixiCanvas = document.getElementById("pixi-canvas");

    pixiCanvas.addEventListener("contextmenu", e =>
    {
      e.stopPropagation();
      if (e.target === pixiCanvas)
      {
        e.preventDefault();
      }
    })
    pixiCanvas.addEventListener("mousewheel", e =>
    {
      if (e.target === pixiCanvas)
      {
        this.camera.deltaZoom(e.wheelDelta / 40, 0.05);
      }
    });

    this.listeners["mouseDown"] = eventManager.addEventListener("mouseDown",
      (e: PIXI.interaction.InteractionEvent, star?: Star) =>
    {
      this.mouseDown(e, star);
    });
    this.listeners["mouseUp"] = eventManager.addEventListener("mouseUp",
      (e: PIXI.interaction.InteractionEvent) =>
    {
      this.mouseUp(e);
    });
    this.listeners["touchStart"] = eventManager.addEventListener("touchStart",
      (e: PIXI.interaction.InteractionEvent) =>
    {
      this.touchStart(e);
    });
    this.listeners["touchEnd"] = eventManager.addEventListener("touchEnd",
      (e: PIXI.interaction.InteractionEvent) =>
    {
      this.touchEnd(e);
    });
    this.listeners["hoverStar"] = eventManager.addEventListener("hoverStar",
      (star: Star) =>
    {
      this.setHoveredStar(star);
    });
    this.listeners["clearHover"] = eventManager.addEventListener("clearHover",
      () =>
    {
      this.clearHoveredStar();
    });
  }
  private preventGhost(delay: number, type: string): void
  {
    if (this.preventingGhost[type])
    {
      window.clearTimeout(this.preventingGhost[type]);
    }
    this.preventingGhost[type] = window.setTimeout(() =>
    {
      this.preventingGhost[type] = null
    }, delay);
  }
  private makeUITransparent(): void
  {
    if (!this.currentAction) return;
    var ui = <HTMLElement> document.getElementsByClassName("galaxy-map-ui")[0];
    if (ui)
    {
      ui.classList.add("prevent-pointer-events", "mouse-event-active-ui");
    }
  }
  private makeUIOpaque(): void
  {
    if (this.currentAction) return;
    var ui = <HTMLElement> document.getElementsByClassName("galaxy-map-ui")[0];
    if (ui)
    {
      ui.classList.remove("prevent-pointer-events", "mouse-event-active-ui");
    }
  }
  private cancelCurrentAction(): void
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

  private touchStart(event: PIXI.interaction.InteractionEvent, star?: Star): void
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
  private touchEnd(event: PIXI.interaction.InteractionEvent): void
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

  private startScroll(event: PIXI.interaction.InteractionEvent): void
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
  private scrollMove(event: PIXI.interaction.InteractionEvent): void
  {
    this.camera.move([event.data.global.x, event.data.global.y]);
  }
  private endScroll(event: PIXI.interaction.InteractionEvent): void
  {
    this.camera.end();
    this.startPoint = undefined;
    this.currentAction = this.stashedAction;
    this.stashedAction = undefined;
    this.makeUIOpaque();
  }
  private zoomMove(event: PIXI.interaction.InteractionEvent): void
  {
    var delta = event.data.global.x + this.currPoint[1] -
      this.currPoint[0] - event.data.global.y;
    this.camera.deltaZoom(delta, 0.005);
    this.currPoint = [event.data.global.x, event.data.global.y];
  }
  // Can be used for touch controls I think
  // private endZoom(event: PIXI.interaction.InteractionEvent): void
  // {
  //   this.startPoint = undefined;
  //   this.currentAction = this.stashedAction;
  //   this.stashedAction = undefined;
  // }
  // private startZoom(event: PIXI.interaction.InteractionEvent): void
  // {
  //   if (this.currentAction !== "zoom")
  //   {
  //     this.stashedAction = this.currentAction;
  //   }
  //   this.currentAction = "zoom";
  //   this.startPoint = this.currPoint = [event.data.global.x, event.data.global.y];
  // }
  private setHoveredStar(star: Star): void
  {
    this.preventGhost(30, "hover");
    if (star !== this.hoveredStar)
    {
      this.hoveredStar = star;
      this.setFleetMoveTarget(star);
    }
  }
  private clearHoveredStar(): void
  {
    var timeout = window.setTimeout(() =>
    {
      if (!this.preventingGhost["hover"])
      {
        this.hoveredStar = null;
        this.clearFleetMoveTarget();
      }
      window.clearTimeout(timeout);
    }, 15);
  }
  private startFleetMove(event: PIXI.interaction.InteractionEvent, star: Star): void
  {
    eventManager.dispatchEvent("startPotentialMove", star);
    this.currentAction = "fleetMove";
    this.makeUITransparent();
  }
  private setFleetMoveTarget(star: Star): void
  {
    if (this.currentAction !== "fleetMove") return;
    eventManager.dispatchEvent("setPotentialMoveTarget", star);
  }
  private completeFleetMove(): void
  {
    if (this.hoveredStar)
    {
      eventManager.dispatchEvent("moveFleets", this.hoveredStar);
    }
    eventManager.dispatchEvent("endPotentialMove");
    this.currentAction = undefined;
    this.makeUIOpaque();
  }
  private clearFleetMoveTarget(): void
  {
    if (this.currentAction !== "fleetMove") return;
    eventManager.dispatchEvent("clearPotentialMoveTarget");
  }
  private startSelect(event: PIXI.interaction.InteractionEvent): void
  {
    this.currentAction = "select";
    this.rectangleSelect.startSelection(event.data.getLocalPosition(this.renderer.layers.main));
    this.makeUITransparent();
  }
  private dragSelect(event: PIXI.interaction.InteractionEvent): void
  {
    this.rectangleSelect.moveSelection(event.data.getLocalPosition(this.renderer.layers.main));
  }
  private endSelect(event: PIXI.interaction.InteractionEvent): void
  {
    this.rectangleSelect.endSelection(event.data.getLocalPosition(this.renderer.layers.main));
    this.currentAction = undefined;
    this.makeUIOpaque();
  }
}
