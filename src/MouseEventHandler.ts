import Camera from "./Camera";
import RectangleSelect from "./RectangleSelect";
import Star from "./Star";
import eventManager from "./eventManager";


type PreventGhostHandles =
{
  hover?: number;
};

type MouseActions =
{
  pan: boolean;
  select: boolean;
  fleetMove: boolean;
};

// tslint:disable:no-bitwise
enum MouseButtons
{
  None   = 0,
  Left   = 1 << 0,
  Right  = 1 << 1,
  Middle = 1 << 2,
}


export default class MouseEventHandler
{
  private interactionManager: PIXI.interaction.InteractionManager;
  private camera: Camera;
  private rectangleSelect: RectangleSelect;

  private hoveredStar: Star | null;
  private pressedButtons: MouseButtons;

  private pixiCanvas: HTMLCanvasElement;

  private readonly currentActions: MouseActions =
  {
    pan: false,
    select: false,
    fleetMove: false,
  };
  private currentActionIsCanceled: boolean = false;
  private actionHasStarted: boolean = false;

  private preventingGhost: PreventGhostHandles =
  {
    hover: undefined,
  };
  private listeners:
  {
    hoverStar?: (star: Star) => void;
    clearHover?: () => void;
  } =
  {
    hoverStar: undefined,
    clearHover: undefined,
  };
  private pixiCanvasListeners:
  {
    mousewheel?: (e: WheelEvent) => void;
    contextmenu?: (e: PointerEvent) => void;
  } =
  {
    mousewheel: undefined,
    contextmenu: undefined,
  };


  constructor(
    interactionManager: PIXI.interaction.InteractionManager,
    camera: Camera,
    selectionLayer: PIXI.Container,
    mainLayer: PIXI.Container,
  )
  {
    this.interactionManager = interactionManager;
    this.camera = camera;
    this.rectangleSelect = new RectangleSelect(selectionLayer, mainLayer);

    this.bindEventHandlers();
    this.addEventListeners();
  }

  private static getButtonChanges(oldButtons: MouseButtons, newButtons: MouseButtons): MouseButtons
  {
    return oldButtons ^ newButtons;
  }
  private static getActionsInButtonChanges(buttonChanges: MouseButtons): MouseActions
  {
    return(
    {
      pan       : Boolean(buttonChanges & MouseButtons.Middle),
      select    : Boolean(buttonChanges & MouseButtons.Left),
      fleetMove : Boolean(buttonChanges & MouseButtons.Right),
    });
  }

  public destroy(): void
  {
    for (let name in this.listeners)
    {
      eventManager.removeEventListener(name, this.listeners[name]);
    }
    for (let name in this.pixiCanvasListeners)
    {
      this.pixiCanvas.removeEventListener(name, this.pixiCanvasListeners[name]);
    }

    this.interactionManager.off("pointerdown", this.onPointerDown);
    this.interactionManager.off("pointerup", this.onPointerUp);
    this.interactionManager.off("pointerupoutside", this.onPointerUp);
    this.interactionManager.off("pointermove", this.onPointerChange);

    this.pixiCanvas = null;
    this.hoveredStar = null;

    this.rectangleSelect.destroy();
    this.rectangleSelect = null;

    this.interactionManager = null;
    this.camera = null;
  }

  private addEventListeners(): void
  {
    this.pixiCanvas = <HTMLCanvasElement> document.getElementById("pixi-canvas");

    this.pixiCanvasListeners.contextmenu = this.handleContextMenu;
    this.pixiCanvas.addEventListener("contextmenu", this.handleContextMenu);

    this.pixiCanvasListeners.mousewheel = this.handleMouseWheel;
    this.pixiCanvas.addEventListener("mousewheel", this.handleMouseWheel);

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

    this.interactionManager.on("pointerdown", this.onPointerDown);
    this.interactionManager.on("pointerup", this.onPointerUp);
    this.interactionManager.on("pointerupoutside", this.onPointerUp);
    this.interactionManager.on("pointermove", this.onPointerChange);

    // TODO 2017.07.29 | keyboard events
  }
  private bindEventHandlers(): void
  {
    this.handleContextMenu = this.handleContextMenu.bind(this);
    this.handleMouseWheel  = this.handleMouseWheel.bind(this);

    this.onPointerDown     = this.onPointerDown.bind(this);
    this.onPointerChange   = this.onPointerChange.bind(this);
    this.onPointerUp       = this.onPointerUp.bind(this);
  }
  private preventGhost(delay: number, type: keyof PreventGhostHandles): void
  {
    if (this.preventingGhost[type] !== undefined)
    {
      window.clearTimeout(this.preventingGhost[type]!);
    }
    this.preventingGhost[type] = window.setTimeout(() =>
    {
      this.preventingGhost[type] = undefined;
    }, delay);
  }
  private makeUITransparent(): void
  {
    const ui = <HTMLElement> document.getElementsByClassName("galaxy-map-ui")[0];
    if (ui)
    {
      ui.classList.add("mouse-event-active-ui");
    }
  }
  private makeUIOpaque(): void
  {
    const ui = <HTMLElement> document.getElementsByClassName("galaxy-map-ui")[0];
    if (ui)
    {
      ui.classList.remove("mouse-event-active-ui");
    }
  }

  private onPointerDown(e: PIXI.interaction.InteractionEvent): void
  {
    this.currentActionIsCanceled = false;
    this.actionHasStarted = true;
    this.makeUITransparent();
    this.onPointerChange(e);
  }
  private onPointerChange(e: PIXI.interaction.InteractionEvent): void
  {
    if (!this.actionHasStarted)
    {
      return;
    }

    const newPressedButtons = this.currentActionIsCanceled ?
      // nullify left & right button
      e.data.buttons & ~MouseButtons.Left & ~MouseButtons.Right :
      e.data.buttons;

    const changedButtons = MouseEventHandler.getButtonChanges(this.pressedButtons, newPressedButtons);

    if (changedButtons)
    {
      this.pressedButtons = newPressedButtons;
      const changedActions = MouseEventHandler.getActionsInButtonChanges(changedButtons);

      for (let key in changedActions)
      {
        if (changedActions[key])
        {
          this.handleActionChange(<keyof MouseActions> key, e);
        }
      }
    }

    if (this.currentActions.pan)
    {
      this.handlePanMove(e);
    }

    if (this.currentActions.select)
    {
      this.handleSelectionMove(e);
    }

    // fleet movement is handled on star hover
  }
  private onPointerUp(e: PIXI.interaction.InteractionEvent): void
  {
    this.onPointerChange(e);

    this.actionHasStarted = false;
    this.makeUIOpaque();
  }

  private handleContextMenu(e: PointerEvent): void
  {
    e.stopPropagation();
    e.preventDefault();
  }
  private handleMouseWheel(e: WheelEvent): void
  {
    this.camera.deltaZoom(e.wheelDelta / 40, 0.05);
    this.rectangleSelect.handleTargetLayerShift();
  }

  private setHoveredStar(star: Star): void
  {
    this.preventGhost(30, "hover");
    if (star !== this.hoveredStar)
    {
      this.hoveredStar = star;
      if (this.currentActions.fleetMove)
      {
        this.setFleetMoveTarget(star);
      }
    }
  }
  private clearHoveredStar(): void
  {
    const timeout = window.setTimeout(() =>
    {
      if (!this.preventingGhost.hover)
      {
        this.hoveredStar = null;
        if (this.currentActions.fleetMove)
        {
          this.clearFleetMoveTarget();
        }
      }
      window.clearTimeout(timeout);
    }, 15);
  }

  private handleActionChange(action: keyof MouseActions, e: PIXI.interaction.InteractionEvent): void
  {
    switch (action)
    {
      case "pan":
      {
        if (!this.currentActions.pan)
        {
          this.handlePanStart(e);
        }
        else
        {
          this.handlePanEnd();
        }

        break;
      }
      case "select":
      {
        if (this.currentActions.fleetMove)
        {
          this.cancelCurrentAction();
        }
        else if (!this.currentActions.select)
        {
          this.handleSelectionStart(e);
        }
        else
        {
          this.completeSelection(e);
        }

        break;
      }
      case "fleetMove":
      {
        if (this.currentActions.select)
        {
          this.cancelCurrentAction();
        }
        else if (!this.currentActions.fleetMove)
        {
          this.handleFleetMoveStart();
        }
        else
        {
          this.completeFleetMove();
        }

        break;
      }
    }
  }
  private cancelCurrentAction(): void
  {
    this.currentActionIsCanceled = true;

    if (this.currentActions.fleetMove)
    {
      this.handleFleetMoveStop();
    }
    if (this.currentActions.select)
    {
      this.handleSelectionStop();
    }
  }

  private handlePanStart(e: PIXI.interaction.InteractionEvent): void
  {
    this.camera.startScroll(e.data.global);
    this.currentActions.pan = true;
  }
  private handlePanMove(e: PIXI.interaction.InteractionEvent): void
  {
    this.camera.scrollMove(e.data.global);
    this.rectangleSelect.handleTargetLayerShift();
  }
  private handlePanEnd(): void
  {
    this.currentActions.pan = false;
  }

  private handleSelectionStart(e: PIXI.interaction.InteractionEvent): void
  {
    this.rectangleSelect.startSelection(e.data.global);
    this.currentActions.select = true;
  }
  private handleSelectionMove(e: PIXI.interaction.InteractionEvent): void
  {
    this.rectangleSelect.moveSelection(e.data.global);
  }
  private completeSelection(e: PIXI.interaction.InteractionEvent): void
  {
    this.rectangleSelect.endSelection();

    this.handleSelectionStop();
  }
  private handleSelectionStop(): void
  {
    this.rectangleSelect.clearSelection();
    this.currentActions.select = false;
  }

  private setFleetMoveTarget(star: Star): void
  {
    eventManager.dispatchEvent("setPotentialMoveTarget", star);
  }
  private clearFleetMoveTarget(): void
  {
    eventManager.dispatchEvent("clearPotentialMoveTarget");
  }
  private handleFleetMoveStart(): void
  {
    eventManager.dispatchEvent("startPotentialMove");

    if (this.hoveredStar)
    {
      this.setFleetMoveTarget(this.hoveredStar);
    }

    this.currentActions.fleetMove = true;
  }
  private completeFleetMove(): void
  {
    if (this.hoveredStar)
    {
      eventManager.dispatchEvent("moveFleets", this.hoveredStar);
    }

    this.handleFleetMoveStop();
  }
  private handleFleetMoveStop(): void
  {
    eventManager.dispatchEvent("endPotentialMove");

    this.currentActions.fleetMove = false;
  }
}
