import {Camera} from "../graphics/Camera";
import {RectangleSelect} from "./RectangleSelect";
import {Star} from "../map/Star";
import {eventManager} from "../app/eventManager";


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

// can't use binary operators in assignment as it clobbers the enum type
// https://github.com/Microsoft/TypeScript/issues/22709
enum MouseButtons
{
  None   = 0,
  Left   = 1,
  Right  = 2,
  Middle = 4,
}


export class MouseEventHandler
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
  private preventMoveAndSelectForCurrentGesture: boolean = false;
  private gestureHasStarted: boolean = false;

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
    // tslint:disable-next-line:no-bitwise
    return oldButtons ^ newButtons;
  }
  private static getActionsInButtonChanges(buttonChanges: MouseButtons): MouseActions
  {
    return(
    {
      // tslint:disable:no-bitwise
      pan       : Boolean(buttonChanges & MouseButtons.Middle),
      select    : Boolean(buttonChanges & MouseButtons.Left),
      fleetMove : Boolean(buttonChanges & MouseButtons.Right),
      // tslint:enable:no-bitwise
    });
  }

  public destroy(): void
  {
    for (const name in this.listeners)
    {
      eventManager.removeEventListener(name, this.listeners[name]);
    }
    for (const name in this.pixiCanvasListeners)
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
    this.pixiCanvas.addEventListener("wheel", this.handleMouseWheel);

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
      clearTimeout(this.preventingGhost[type]!);
    }
    this.preventingGhost[type] = setTimeout(() =>
    {
      this.preventingGhost[type] = undefined;
    }, delay);
  }
  private makeUITransparent(): void
  {
    const elementsToHide = document.getElementsByClassName("hide-when-user-interacts-with-map");
    for (let i = 0; i < elementsToHide.length; i++)
    {
      elementsToHide[i].classList.add("being-hidden");
    }
  }
  private makeUIOpaque(): void
  {
    const elementsToHide = document.getElementsByClassName("hide-when-user-interacts-with-map");
    for (let i = 0; i < elementsToHide.length; i++)
    {
      elementsToHide[i].classList.remove("being-hidden");
    }
  }

  private onPointerDown(e: PIXI.interaction.InteractionEvent): void
  {
    this.preventMoveAndSelectForCurrentGesture = false;
    this.gestureHasStarted = true;
    this.onPointerChange(e);
  }
  private onPointerChange(e: PIXI.interaction.InteractionEvent): void
  {
    if (!this.gestureHasStarted)
    {
      return;
    }

    const shouldNullifyLeftAndRightButtons = this.preventMoveAndSelectForCurrentGesture;

    // tslint:disable:no-bitwise
    const validPressedButtons = shouldNullifyLeftAndRightButtons ?
      e.data.buttons & ~MouseButtons.Left & ~MouseButtons.Right :
      e.data.buttons;
    // tslint:enable:no-bitwise

    const changedButtons = MouseEventHandler.getButtonChanges(this.pressedButtons, validPressedButtons);

    if (changedButtons)
    {
      this.pressedButtons = validPressedButtons;
      const changedActions = MouseEventHandler.getActionsInButtonChanges(changedButtons);

      for (const key in changedActions)
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

    this.gestureHasStarted = false;
  }

  private handleContextMenu(e: MouseEvent): void
  {
    e.stopPropagation();
    e.preventDefault();
  }
  private handleMouseWheel(e: WheelEvent): void
  {
    this.camera.deltaZoom(e.deltaY / 40, 0.05);
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
    const timeout = setTimeout(() =>
    {
      if (!this.preventingGhost.hover)
      {
        this.hoveredStar = null;
        if (this.currentActions.fleetMove)
        {
          this.clearFleetMoveTarget();
        }
      }
      clearTimeout(timeout);
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
          const wasFirstActionInGesture = !this.currentActions.fleetMove && !this.currentActions.select;
          if (wasFirstActionInGesture)
          {
            this.preventMoveAndSelectForCurrentGesture = true;
          }

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
          this.completeSelection();
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

    if (this.hasActiveAction())
    {
      this.makeUITransparent();
    }
    else
    {
      this.makeUIOpaque();
    }
  }
  private cancelCurrentAction(): void
  {
    if (this.currentActions.fleetMove)
    {
      this.handleFleetMoveStop();
    }
    if (this.currentActions.select)
    {
      this.handleSelectionStop();
    }
  }
  private hasActiveAction(): boolean
  {
    return Object.keys(this.currentActions).some(key =>
    {
      return this.currentActions[key];
    });
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
  private completeSelection(): void
  {
    this.rectangleSelect.endSelection();

    this.handleSelectionStop();
  }
  private handleSelectionStop(): void
  {
    this.rectangleSelect.clearSelection();

    this.currentActions.select = false;
    this.preventMoveAndSelectForCurrentGesture = true;
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
    this.preventMoveAndSelectForCurrentGesture = true;
  }
}
