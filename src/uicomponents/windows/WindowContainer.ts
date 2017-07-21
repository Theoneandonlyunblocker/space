import * as React from "react";
import * as ReactDOM from "react-dom";

import {default as WindowResizeHandle, PropTypes as WindowResizeHandleProps} from "./WindowResizeHandle";
import * as windowManager from "./windowManager";

import {Direction} from "../../Direction";
import {Rect} from "../../Rect";
import
{
  clamp,
  shallowCopy,
  shallowExtend,
} from "../../utility";

import {default as DragPositioner} from "../mixins/DragPositioner";
import applyMixins from "../mixins/applyMixins";

export interface PropTypes extends React.Props<any>
{
  containerElement: HTMLElement;
  getInitialPosition?: (ownRect: Rect, container: HTMLElement) => Rect;
  isResizable: boolean;

  // TODO 2017.07.05 | shouldn't these be doable in css?
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

  private resizeStartQuadrant: {top: boolean, left: boolean};
  private resizeStartPosition: Rect =
  {
    top: undefined,
    left: undefined,
    width: undefined,
    height: undefined,
  };

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
    this.setInitialPosition();
    windowManager.handleMount(this);
  }
  public componentWillUnmount(): void
  {
    windowManager.handleUnount(this);
  }
  public render()
  {
    // const customAttributes = this.props.attributes ? shallowCopy(this.props.attributes) : {};
    const customAttributes = {};
    const defaultAttributes: React.HTMLAttributes =
    {
      className: "window-container",
      style:
      {
        top: this.dragPositioner.position.top,
        left: this.dragPositioner.position.left,
        width: this.dragPositioner.position.width,
        height: this.dragPositioner.position.height,
        zIndex: this.state.zIndex,
        minWidth: this.props.minWidth,
        minHeight: this.props.minHeight,
        maxWidth: this.props.maxWidth,
        maxHeight: this.props.maxHeight,
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
    return shallowCopy(this.dragPositioner.position);
  }
  public onMouseDown(e: React.MouseEvent | React.TouchEvent)
  {
    this.dragPositioner.handleReactDownEvent(e);

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
  }
  private setInitialPosition()
  {
    const initialRect = ReactDOM.findDOMNode(this).getBoundingClientRect();
    const position: Rect =
    {
      top: initialRect.top,
      left: initialRect.left,
      width: initialRect.width,
      height: initialRect.height,
    };

    const container = this.props.containerElement;
    const requestedPosition = this.props.getInitialPosition ?
      this.props.getInitialPosition(position, container) :
      windowManager.getDefaultInitialPosition(position, container);

    const maxWidth = Math.min(this.props.maxWidth, container.offsetWidth);
    const maxHeight = Math.min(this.props.maxHeight, container.offsetHeight);

    position.width = clamp(requestedPosition.width, this.props.minWidth, maxWidth);
    position.height = clamp(requestedPosition.height, this.props.minHeight, maxHeight);
    position.left = clamp(requestedPosition.left, 0, container.offsetWidth - position.width);
    position.top = clamp(requestedPosition.top, 0, container.offsetHeight - position.height);

    this.dragPositioner.position = position;
    this.dragPositioner.updateDOMNodeStyle();
  }
  private handleResizeMove(rawDeltaX: number, rawDeltaY: number): void
  {
    const minWidth = this.props.minWidth || 0;
    const maxWidth = this.props.maxWidth || window.innerWidth;
    const minHeight = this.props.minHeight || 0;
    const maxHeight = this.props.maxHeight || window.innerHeight;



    if (this.resizeStartQuadrant.left)
    {
      const deltaX = clamp(
        rawDeltaX,
        this.resizeStartPosition.width - maxWidth,
        this.resizeStartPosition.width - minWidth,
      );

      this.dragPositioner.position.width = this.resizeStartPosition.width - deltaX;
      this.dragPositioner.position.left = this.resizeStartPosition.left + deltaX;
    }
    else
    {
      const deltaX = rawDeltaX;

      this.dragPositioner.position.width = this.resizeStartPosition.width + deltaX;
      this.dragPositioner.position.width = clamp(this.dragPositioner.position.width, minWidth, maxWidth);
    }

    if (this.resizeStartQuadrant.top)
    {
      const deltaY = clamp(
        rawDeltaY,
        this.resizeStartPosition.height - maxHeight,
        this.resizeStartPosition.height - minHeight,
      );

      this.dragPositioner.position.top = this.resizeStartPosition.top + deltaY;
      this.dragPositioner.position.height = this.resizeStartPosition.height - deltaY;
    }
    else
    {
      const deltaY = rawDeltaY;

      this.dragPositioner.position.height = this.resizeStartPosition.height + deltaY;
      this.dragPositioner.position.height = clamp(this.dragPositioner.position.height, minHeight, maxHeight);
    }

    this.dragPositioner.updateDOMNodeStyle();
  }
  private handleResizeStart(x: number, y: number): void
  {
    const rect = ReactDOM.findDOMNode(this).getBoundingClientRect();
    const midX = rect.left + rect.width / 2;
    const midY = rect.top + rect.height / 2;

    this.resizeStartPosition = shallowCopy(this.dragPositioner.position);
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
}

const Factory: React.Factory<PropTypes> = React.createFactory(WindowContainerComponent);
export default Factory;

