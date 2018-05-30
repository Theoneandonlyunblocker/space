import * as React from "react";
import * as ReactDOM from "react-dom";

import {Direction} from "../../Direction";
import {Rect} from "../../Rect";
import
{
  clamp,
  shallowExtend,
} from "../../utility";
import {default as DragPositioner} from "../mixins/DragPositioner";
import applyMixins from "../mixins/applyMixins";

import {default as WindowResizeHandle, PropTypes as WindowResizeHandleProps} from "./WindowResizeHandle";
import * as windowManager from "./windowManager";


export interface PropTypes extends React.Props<any>
{
  containingAreaElement: HTMLElement;
  getInitialPosition?: (ownRect: Rect, container: HTMLElement) => Rect;
  isResizable: boolean;

  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
}

interface StateType
{
  zIndex: number;
}


let id = 0;


export class WindowContainerComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "WindowContainer";
  public state: StateType;

  public id: number;
  public dragPositioner: DragPositioner<WindowContainerComponent>;

  private resizeStartQuadrant: {left: boolean; top: boolean};
  private resizeStartPosition: Rect =
  {
    top   : undefined,
    left  : undefined,
    width : undefined,
    height: undefined,
  };

  private minWidth : number;
  private minHeight: number;
  private maxWidth : number;
  private maxHeight: number;

  private ownDOMNode: HTMLDivElement;
  private onDocumentWindowResizeTimeoutHandle: number | undefined;


  constructor(props: PropTypes)
  {
    super(props);

    this.id = id++;
    this.bindMethods();

    this.state =
    {
      zIndex: windowManager.getNewZIndex(this),
    };

    this.dragPositioner = new DragPositioner(this,
    {
      preventAutoResize: true,
      startOnHandleElementOnly: true,
    });

    applyMixins(this, this.dragPositioner);
  }

  public componentDidMount(): void
  {
    this.ownDOMNode = ReactDOM.findDOMNode(this);
    this.setInitialPosition();
    windowManager.handleMount(this);

    window.addEventListener("resize", this.onDocumentWindowResize, false);
  }
  public componentWillUnmount(): void
  {
    windowManager.handleUnount(this);

    window.removeEventListener("resize", this.onDocumentWindowResize);

    if (this.onDocumentWindowResizeTimeoutHandle !== undefined)
    {
      window.cancelAnimationFrame(this.onDocumentWindowResizeTimeoutHandle);
    }
  }
  public componentWillReceiveProps(newProps: PropTypes): void
  {
    const propsToCheck: (keyof PropTypes)[] = ["minWidth", "minHeight", "maxWidth", "maxHeight"];
    for (const prop of propsToCheck)
    {
      if (this.props[prop] !== newProps[prop])
      {
        this.setDimensionBounds(newProps);
        break;
      }
    }
  }
  public render()
  {
    // const customAttributes = this.props.attributes ? shallowCopy(this.props.attributes) : {};
    const customAttributes = {};
    const defaultAttributes: React.HTMLAttributes<HTMLDivElement> =
    {
      className: "window-container",
      style:
      {
        top: this.dragPositioner.position.top,
        left: this.dragPositioner.position.left,
        width: this.dragPositioner.position.width,
        height: this.dragPositioner.position.height,
        zIndex: this.state.zIndex,
      },
    };

    const attributes = shallowExtend(customAttributes, defaultAttributes);

    return(
      React.DOM.div(attributes,
        this.props.children,
        !this.props.isResizable ? null : this.makeResizeHandles(),
      )
    );
  }
  public getPosition(): Rect
  {
    return(
    {
      left: this.dragPositioner.position.left!,
      top: this.dragPositioner.position.top!,
      width: this.dragPositioner.position.width!,
      height: this.dragPositioner.position.height!,
    });
  }
  public onMouseDown(e: React.MouseEvent<any> | React.TouchEvent<any>)
  {
    this.dragPositioner.handleReactDownEvent(e);

    this.bringToTop();
  }
  public isTopMostWindow(): boolean
  {
    return windowManager.getWindowsByZIndex()[0] === this;
  }
  public bringToTop(): void
  {
    this.setState(
    {
      zIndex: windowManager.getNewZIndex(this),
    });
  }

  private bindMethods()
  {
    this.onMouseDown = this.onMouseDown.bind(this);
    this.handleResizeMove = this.handleResizeMove.bind(this);
    this.handleResizeStart = this.handleResizeStart.bind(this);
    this.setInitialPosition = this.setInitialPosition.bind(this);
    this.makeResizeHandles = this.makeResizeHandles.bind(this);
    this.isTopMostWindow = this.isTopMostWindow.bind(this);
    this.bringToTop = this.bringToTop.bind(this);
    this.setDimensionBounds = this.setDimensionBounds.bind(this);
    this.onDocumentWindowResize = this.onDocumentWindowResize.bind(this);
  }
  private setInitialPosition()
  {
    this.setDimensionBounds();

    const initialRect = this.ownDOMNode.getBoundingClientRect();
    const position: Rect =
    {
      top: initialRect.top,
      left: initialRect.left,
      width: initialRect.width,
      height: initialRect.height,
    };

    const container = this.props.containingAreaElement;
    const requestedPosition = this.props.getInitialPosition ?
      this.props.getInitialPosition(position, container) :
      windowManager.getDefaultInitialPosition(position, container);

    position.width = clamp(requestedPosition.width, this.minWidth, this.maxWidth);
    position.height = clamp(requestedPosition.height, this.minHeight, this.maxHeight);
    position.left = clamp(requestedPosition.left, 0, container.offsetWidth - position.width);
    position.top = clamp(requestedPosition.top, 0, container.offsetHeight - position.height);

    this.dragPositioner.position = position;
    this.dragPositioner.updateDOMNodeStyle();

    const firstChildElement = this.ownDOMNode.firstElementChild;
    if (firstChildElement)
    {
      const firstChildRect = firstChildElement.getBoundingClientRect();
      // needs to be updated since we called this.dragPositioner.updateDOMNodeStyle()
      const ownRect = this.ownDOMNode.getBoundingClientRect();

      const horizontalPadding = firstChildRect.width - ownRect.width;
      const verticalPadding = firstChildRect.height - ownRect.height;

      this.ownDOMNode.style.paddingRight = "" + horizontalPadding + "px";
      this.ownDOMNode.style.paddingBottom = "" + verticalPadding + "px";
    }
  }
  private handleResizeMove(rawDeltaX: number, rawDeltaY: number): void
  {
    if (this.resizeStartQuadrant.left)
    {
      const deltaX = clamp(
        rawDeltaX,
        this.resizeStartPosition.width - this.maxWidth,
        this.resizeStartPosition.width - this.minWidth,
      );

      this.dragPositioner.position.width = this.resizeStartPosition.width - deltaX;
      this.dragPositioner.position.left = this.resizeStartPosition.left + deltaX;
    }
    else
    {
      const deltaX = rawDeltaX;

      this.dragPositioner.position.width = this.resizeStartPosition.width + deltaX;
      this.dragPositioner.position.width = clamp(this.dragPositioner.position.width, this.minWidth, this.maxWidth);
    }

    if (this.resizeStartQuadrant.top)
    {
      const deltaY = clamp(
        rawDeltaY,
        this.resizeStartPosition.height - this.maxHeight,
        this.resizeStartPosition.height - this.minHeight,
      );

      this.dragPositioner.position.top = this.resizeStartPosition.top + deltaY;
      this.dragPositioner.position.height = this.resizeStartPosition.height - deltaY;
    }
    else
    {
      const deltaY = rawDeltaY;

      this.dragPositioner.position.height = this.resizeStartPosition.height + deltaY;
      this.dragPositioner.position.height = clamp(this.dragPositioner.position.height, this.minHeight, this.maxHeight);
    }

    this.dragPositioner.updateDOMNodeStyle();
  }
  private handleResizeStart(x: number, y: number): void
  {
    const rect = this.ownDOMNode.getBoundingClientRect();
    const midX = rect.left + rect.width / 2;
    const midY = rect.top + rect.height / 2;

    this.resizeStartPosition = this.getPosition();
    this.resizeStartQuadrant =
    {
      left: x < midX,
      top: y < midY,
    };
  }
  private makeResizeHandles(directions: Direction[] | "all" = "all"): React.ReactElement<WindowResizeHandleProps>[]
  {
    const directionsToCreate: Direction[] = directions === "all" ?
      ["n", "e", "w", "s", "ne", "se", "sw", "nw"] :
      directions.slice(0);

    return directionsToCreate.map(direction =>
    {
      return WindowResizeHandle(
      {
        handleResizeMove: this.handleResizeMove,
        handleResizeStart: this.handleResizeStart,
        direction: direction,
        key: direction,
      });
    });
  }
  private setDimensionBounds(props: PropTypes = this.props): void
  {
    const container = props.containingAreaElement;
    const containerRect = container.getBoundingClientRect();

    this.minWidth  = Math.min(props.minWidth , containerRect.width);
    this.minHeight = Math.min(props.minHeight, containerRect.height);
    this.maxWidth  = Math.min(props.maxWidth , containerRect.width);
    this.maxHeight = Math.min(props.maxHeight, containerRect.height);

    this.ownDOMNode.style.minWidth = "" + this.minWidth + "px";
    this.ownDOMNode.style.minHeight = "" + this.minHeight + "px";
    this.ownDOMNode.style.maxWidth = "" + this.maxWidth + "px";
    this.ownDOMNode.style.maxHeight = "" + this.maxHeight + "px";
  }
  private onDocumentWindowResize(): void
  {
    if (this.onDocumentWindowResizeTimeoutHandle !== undefined)
    {
      window.cancelAnimationFrame(this.onDocumentWindowResizeTimeoutHandle);
    }

    this.onDocumentWindowResizeTimeoutHandle = window.requestAnimationFrame(() =>
    {
      this.setDimensionBounds();

      this.clampToContainingAreaElementBounds();
    });
  }
  private clampToContainingAreaElementBounds(): void
  {
    const container = this.props.containingAreaElement;
    const containerRect = container.getBoundingClientRect();

    this.dragPositioner.position.width = clamp(
      this.dragPositioner.position.width,
      this.minWidth,
      this.maxWidth,
    );

    this.dragPositioner.position.height = clamp(
      this.dragPositioner.position.height,
      this.minHeight,
      this.maxHeight,
    );

    this.dragPositioner.position.left = clamp(
      this.dragPositioner.position.left,
      containerRect.left,
      containerRect.right - this.dragPositioner.position.width,
    );

    this.dragPositioner.position.top = clamp(
      this.dragPositioner.position.top,
      containerRect.top,
      containerRect.bottom - this.dragPositioner.position.height,
    );

    this.dragPositioner.updateDOMNodeStyle();
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(WindowContainerComponent);
export default Factory;

