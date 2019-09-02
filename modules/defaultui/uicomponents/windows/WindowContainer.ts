import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import * as ReactDOM from "react-dom";

import {Direction} from "./Direction";
import {Rect} from "../../../../src/math/Rect";
import
{
  clamp,
  mergeReactAttributes,
} from "../../../../src/generic/utility";
import {DragPositioner} from "../mixins/DragPositioner";
import {applyMixins} from "../mixins/applyMixins";

import {WindowResizeHandle, PropTypes as WindowResizeHandleProps} from "./WindowResizeHandle";
import * as windowManager from "./windowManager";


export interface PropTypes extends React.Props<any>
{
  containingAreaElement: HTMLElement;
  getInitialPosition?: (ownRect: Rect, container: HTMLElement) => Rect;
  isResizable: boolean;
  attributes?: React.HTMLAttributes<HTMLDivElement>;

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

  private readonly ownDOMNode = React.createRef<HTMLDivElement>();
  private readonly parentContainer: HTMLDivElement;
  private onDocumentWindowResizeTimeoutHandle: number | undefined;


  constructor(props: PropTypes)
  {
    super(props);

    this.id = id++;
    this.bindMethods();

    this.parentContainer = <HTMLDivElement>document.getElementById("windows-container");

    this.state =
    {
      zIndex: windowManager.getNewZIndex(this),
    };

    this.dragPositioner = new DragPositioner(this, this.ownDOMNode,
    {
      preventAutoResize: true,
      startOnHandleElementOnly: true,
    });

    applyMixins(this, this.dragPositioner);
  }

  public componentDidMount(): void
  {
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
  public componentDidUpdate(prevProps: PropTypes): void
  {
    const propsToCheck: (keyof PropTypes)[] = ["minWidth", "minHeight", "maxWidth", "maxHeight"];
    for (const prop of propsToCheck)
    {
      if (prevProps[prop] !== this.props[prop])
      {
        this.setDimensionBounds(this.props);
        break;
      }
    }
  }
  public render()
  {
    const defaultAttributes: React.HTMLAttributes<HTMLDivElement> & React.ClassAttributes<HTMLDivElement> =
    {
      className: "window-container hide-when-user-interacts-with-map",
      ref: this.ownDOMNode,
      style:
      {
        top: this.dragPositioner.position.top,
        left: this.dragPositioner.position.left,
        width: this.dragPositioner.position.width,
        height: this.dragPositioner.position.height,
        zIndex: this.state.zIndex,
      },
    };

    const customAttributes = this.props.attributes || {};
    const attributes = mergeReactAttributes(defaultAttributes, customAttributes);

    return(
      ReactDOM.createPortal(
        ReactDOMElements.div(attributes,
          this.props.children,
          !this.props.isResizable ? null : this.makeResizeHandles(),
        ),
        this.parentContainer,
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

    const initialRect = this.ownDOMNode.current.getBoundingClientRect();
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

    const firstChildElement = this.ownDOMNode.current.firstElementChild;
    if (firstChildElement)
    {
      const firstChildRect = firstChildElement.getBoundingClientRect();
      // needs to be updated since we called this.dragPositioner.updateDOMNodeStyle()
      const ownRect = this.ownDOMNode.current.getBoundingClientRect();

      const horizontalPadding = firstChildRect.width - ownRect.width;
      const verticalPadding = firstChildRect.height - ownRect.height;

      this.ownDOMNode.current.style.paddingRight = "" + horizontalPadding + "px";
      this.ownDOMNode.current.style.paddingBottom = "" + verticalPadding + "px";
    }
  }
  private handleResizeMove(rawX: number, rawY: number): void
  {
    if (isFinite(rawX))
    {
      if (this.resizeStartQuadrant.left)
      {
        const right = this.resizeStartPosition.left + this.resizeStartPosition.width;

        const minX = right - this.maxWidth;
        const maxX = right - this.minWidth;

        const x = clamp(rawX, minX, maxX);

        this.dragPositioner.position.width = right - x;
        this.dragPositioner.position.left = x;
      }
      else
      {
        const minX = this.resizeStartPosition.left + this.minWidth;
        const maxX = this.resizeStartPosition.left + this.maxWidth;

        const x = clamp(rawX, minX, maxX);

        this.dragPositioner.position.width = x - this.resizeStartPosition.left;
      }
    }

    if (isFinite(rawY))
    {
      if (this.resizeStartQuadrant.top)
      {
        const bottom = this.resizeStartPosition.top + this.resizeStartPosition.height;

        const minY = bottom - this.maxHeight;
        const maxY = bottom - this.minHeight;

        const y = clamp(rawY, minY, maxY);

        this.dragPositioner.position.height = bottom - y;
        this.dragPositioner.position.top = y;
      }
      else
      {
        const minY = this.resizeStartPosition.top + this.minHeight;
        const maxY = this.resizeStartPosition.top + this.maxHeight;

        const y = clamp(rawY, minY, maxY);

        this.dragPositioner.position.height = y - this.resizeStartPosition.top;
      }
    }

    this.dragPositioner.updateDOMNodeStyle();
  }
  private handleResizeStart(x: number, y: number): void
  {
    const rect = this.ownDOMNode.current.getBoundingClientRect();
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

    this.ownDOMNode.current.style.minWidth = "" + this.minWidth + "px";
    this.ownDOMNode.current.style.minHeight = "" + this.minHeight + "px";
    this.ownDOMNode.current.style.maxWidth = "" + this.maxWidth + "px";
    this.ownDOMNode.current.style.maxHeight = "" + this.maxHeight + "px";
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

export const WindowContainer: React.Factory<PropTypes> = React.createFactory(WindowContainerComponent);

