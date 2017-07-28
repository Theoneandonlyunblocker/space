import Camera from "./Camera";
import RectangleSelect from "./RectangleSelect";
import Renderer from "./Renderer";
import Star from "./Star";
import eventManager from "./eventManager";

type Action =
  "select" |
  "fleetMove" |
  "scroll" |
  "zoom";

type PreventGhostKey =
  "hover" |
  "mouseUp" |
  "mouseDown";

export default class MouseEventHandler
{
  private interactionManager: PIXI.interaction.InteractionManager;
  private renderer: Renderer;
  private camera: Camera;
  private rectangleSelect: RectangleSelect;

  private startPoint: number[];
  private currPoint: number[];

  private currentAction: Action;
  private stashedAction: Action;

  private hoveredStar: Star;

  private preventingGhost:
  {
    hover: number,
    mouseUp: number,
    mouseDown: number,
  } =
  {
    hover: undefined,
    mouseUp: undefined,
    mouseDown: undefined,
  };
  private listeners:
  {
    hoverStar: (star: Star) => void,
    clearHover: () => void,
  } =
  {
    hoverStar: undefined,
    clearHover: undefined,
  };

  constructor(renderer: Renderer, interactionManager: PIXI.interaction.InteractionManager, camera: Camera)
  {
    this.renderer = renderer;
    this.interactionManager = interactionManager;
    this.camera = camera;
    this.rectangleSelect = new RectangleSelect(renderer.layers.select);
    this.currentAction = undefined;

    this.bindEventHandlers();
    this.addEventListeners();
  }

  public destroy(): void
  {
    for (let name in this.listeners)
    {
      eventManager.removeEventListener(name, this.listeners[name]);
    }

    this.interactionManager.off("pointerdown", this.mouseDown);
    this.interactionManager.off("pointerup", this.mouseUp);
    this.interactionManager.off("pointerupoutside", this.mouseUp);
    this.interactionManager.off("pointermove", this.mouseMove);

    this.hoveredStar = null;

    this.rectangleSelect.destroy();
    this.rectangleSelect = null;

    this.renderer = null;
    this.interactionManager = null;
    this.camera = null;
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
    });
    pixiCanvas.addEventListener("mousewheel", e =>
    {
      if (e.target === pixiCanvas)
      {
        this.camera.deltaZoom(e.wheelDelta / 40, 0.05);
      }
    });

    this.listeners.hoverStar = eventManager.addEventListener("hoverStar",
      (star: Star) =>
    {
      this.setHoveredStar(star);
    });
    this.listeners.clearHover = eventManager.addEventListener("clearHover",
      () =>
    {
      this.clearHoveredStar();
    });
  }
  private bindEventHandlers(): void
  {
    this.mouseMove = this.mouseMove.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.mouseDown = this.mouseDown.bind(this);
  }
  private mouseMove(event: PIXI.interaction.InteractionEvent): void
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
  private mouseUp(event: PIXI.interaction.InteractionEvent): void
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
        if (!this.preventingGhost.mouseUp)
        {
          this.endSelect(event);
        }
        break;
      }
      case "fleetMove":
      {
        if (!this.preventingGhost.mouseUp)
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
  private mouseDown(event: PIXI.interaction.InteractionEvent, star?: Star): void
  {
    if (this.preventingGhost.mouseDown)
    {
      return;
    }

    const originalEvent = <MouseEvent> event.data.originalEvent;
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
  private preventGhost(delay: number, type: PreventGhostKey): void
  {
    if (this.preventingGhost[type])
    {
      window.clearTimeout(this.preventingGhost[type]);
    }
    this.preventingGhost[type] = window.setTimeout(() =>
    {
      this.preventingGhost[type] = null;
    }, delay);
  }
  private makeUITransparent(): void
  {
    if (!this.currentAction)
    {
      return;
    }
    const ui = <HTMLElement> document.getElementsByClassName("galaxy-map-ui")[0];
    if (ui)
    {
      ui.classList.add("prevent-pointer-events", "mouse-event-active-ui");
    }
  }
  private makeUIOpaque(): void
  {
    if (this.currentAction)
    {
      return;
    }
    const ui = <HTMLElement> document.getElementsByClassName("galaxy-map-ui")[0];
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
  private startScroll(event: PIXI.interaction.InteractionEvent): void
  {
    // TODO 2017.07.28 | doesn't work
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
    const delta = event.data.global.x + this.currPoint[1] -
      this.currPoint[0] - event.data.global.y;
    this.camera.deltaZoom(delta, 0.005);
    this.currPoint = [event.data.global.x, event.data.global.y];
  }
  // these can be used for touch controls I think
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
    const timeout = window.setTimeout(() =>
    {
      if (!this.preventingGhost.hover)
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
    if (this.currentAction !== "fleetMove")
    {
      return;
    }
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
    if (this.currentAction !== "fleetMove")
    {
      return;
    }
    eventManager.dispatchEvent("clearPotentialMoveTarget");
  }
  private startSelect(event: PIXI.interaction.InteractionEvent): void
  {
    this.currentAction = "select";
    // TODO 2017.07.28 | use interactionmanager
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
