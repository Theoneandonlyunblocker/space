/// <reference path="../../../lib/react-global.d.ts" />

import {Direction} from "../../Direction";
import eventManager from "../../eventManager";
import {clamp} from "../../utility";

import {default as PopupResizeHandle, PropTypes as PopupResizeHandleProps} from "./PopupResizeHandle";

import {default as DragPositioner, DragPositionerProps} from "../mixins/DragPositioner";
import applyMixins from "../mixins/applyMixins";

export interface InitialPositionRect
{
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface CustomPopupProps
{
  resizable?: boolean;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  initialPosition?:
  {
    top?: number;
    left?: number;
    width?: number;
    height?: number;
  };

  dragPositionerProps?: DragPositionerProps;
}

export interface PropTypes extends CustomPopupProps, React.Props<any>
{
  content: React.ReactElement<any>;

  id?: number;
  incrementZIndex: (childZIndex: number) => number;
  closePopup: () => void;
  getInitialPosition: (childRect: InitialPositionRect, container: HTMLElement) =>
  {
    left: number;
    top: number;
  };
}

interface StateType
{
  zIndex?: number;
}

interface ContentComponent extends React.Component<any, any>
{
  parentPopupDidMount?: () => void;
}

export class PopupComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "Popup";
  state: StateType;

  dragPositioner: DragPositioner<PopupComponent>;
  private resizeStartQuadrant: {top: boolean, left: boolean};
  private resizeStartPos: {x: number, y: number};
  private resizeStartSize: {width: number, height: number};

  ref_TODO_content: ContentComponent;

  constructor(props: PropTypes)
  {
    super(props);

    this.state = this.getInitialStateTODO();

    this.bindMethods();

    this.dragPositioner = new DragPositioner(this, this.props.dragPositionerProps);
    applyMixins(this, this.dragPositioner);
  }

  componentDidMount()
  {
    this.setInitialPosition();
  }

  onMouseDown(e: React.MouseEvent | React.TouchEvent)
  {
    this.dragPositioner.handleReactDownEvent(e);
    const newZIndex = this.props.incrementZIndex(this.state.zIndex);
    if (this.state.zIndex !== newZIndex)
    {
      this.setState(
      {
        zIndex: this.props.incrementZIndex(this.state.zIndex),
      });
    }
  }

  setInitialPosition()
  {
    const domRect = ReactDOM.findDOMNode(this).getBoundingClientRect();
    const rect: InitialPositionRect =
    {
      top: domRect.top,
      left: domRect.left,
      width: domRect.width,
      height: domRect.height,
    };
    let left: number;
    let top: number;

    const container = this.dragPositioner.containerElement;
    if (this.props.initialPosition)
    {
      rect.top = this.props.initialPosition.top || rect.top;
      rect.left = this.props.initialPosition.left || rect.left;

      if (this.props.initialPosition.width)
      {
        rect.width = Math.min(this.props.initialPosition.width, container.offsetWidth);
      }
      if (this.props.initialPosition.height)
      {
        rect.height = Math.min(this.props.initialPosition.height, container.offsetHeight);
      }

      if (rect.left || rect.top)
      {
        left = rect.left;
        top = rect.top;
      }
    }
    if (!left && !top)
    {
      const position = this.props.getInitialPosition(rect, container);

      left = position.left;
      top = position.top;
    }

    left = clamp(left, 0, container.offsetWidth - rect.width);
    top = clamp(top, 0, container.offsetHeight - rect.height);

    this.dragPositioner.dragPos.y = top;
    this.dragPositioner.dragPos.x = left;
    this.dragPositioner.dragSize.x = Math.min(window.innerWidth, rect.width);
    this.dragPositioner.dragSize.y = Math.min(window.innerHeight, rect.height);
    this.setState(
    {
      zIndex: this.props.incrementZIndex(this.state.zIndex),
    }, () =>
    {
      if (this.ref_TODO_content.parentPopupDidMount)
      {
        this.ref_TODO_content.parentPopupDidMount();
      }
    });
  }

  public render()
  {
    const divProps: React.HTMLAttributes =
    {
      className: "popup draggable-container",
      onTouchStart: this.onMouseDown,
      onMouseDown: this.onMouseDown,
      style:
      {
        top: this.dragPositioner.dragPos ? this.dragPositioner.dragPos.y : 0,
        left: this.dragPositioner.dragPos ? this.dragPositioner.dragPos.x : 0,
        width: this.dragPositioner.dragSize.x,
        height: this.dragPositioner.dragSize.y,
        zIndex: this.state.zIndex,
        minWidth: this.props.minWidth,
        minHeight: this.props.minHeight,
      },
    };

    if (this.dragPositioner.isDragging)
    {
      divProps.className += " dragging";
    }

    const contentProps =
    {
      closePopup: this.props.closePopup,
      ref: (content: ContentComponent) =>
      {
        this.ref_TODO_content = content;
      },
    };

    const resizeHandles = !this.props.resizable ? null : this.makeResizeHandles();

    return(
      React.DOM.div(divProps,
        // TODO 24.06.2017 | why??
        // this causes lots of problems I think
        React.cloneElement(this.props.content, contentProps),
        resizeHandles,
      )
    );
  }

  private bindMethods()
  {
    this.onMouseDown = this.onMouseDown.bind(this);
    this.handleResizeMove = this.handleResizeMove.bind(this);
    this.handleResizeStart = this.handleResizeStart.bind(this);
    this.setInitialPosition = this.setInitialPosition.bind(this);
  }
  private getInitialStateTODO(): StateType
  {
    return(
    {
      zIndex: -1,
    });
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
        this.resizeStartSize.width - maxWidth,
        this.resizeStartSize.width - minWidth,
      );

      this.dragPositioner.dragSize.x = this.resizeStartSize.width - deltaX;
      this.dragPositioner.dragPos.x = this.resizeStartPos.x + deltaX;
    }
    else
    {
      const deltaX = rawDeltaX;

      this.dragPositioner.dragSize.x = this.resizeStartSize.width + deltaX;
      this.dragPositioner.dragSize.x = clamp(this.dragPositioner.dragSize.x, minWidth, maxWidth);
    }

    if (this.resizeStartQuadrant.top)
    {
      const deltaY = clamp(
        rawDeltaY,
        this.resizeStartSize.height - maxHeight,
        this.resizeStartSize.height - minHeight,
      );

      this.dragPositioner.dragPos.y = this.resizeStartPos.y + deltaY;
      this.dragPositioner.dragSize.y = this.resizeStartSize.height - deltaY;
    }
    else
    {
      const deltaY = rawDeltaY;

      this.dragPositioner.dragSize.y = this.resizeStartSize.height + deltaY;
      this.dragPositioner.dragSize.y = clamp(this.dragPositioner.dragSize.y, minHeight, maxHeight);
    }


    this.dragPositioner.updateDOMNodeStyle();
    eventManager.dispatchEvent("popupResized");
  }
  private handleResizeStart(x: number, y: number): void
  {
    const rect = ReactDOM.findDOMNode(this).getBoundingClientRect();
    const midX = rect.left + rect.width / 2;
    const midY = rect.top + rect.height / 2;

    this.resizeStartPos =
    {
      x: this.dragPositioner.dragPos.x,
      y: this.dragPositioner.dragPos.y,
    };
    this.resizeStartSize =
    {
      width: this.dragPositioner.dragSize.x,
      height: this.dragPositioner.dragSize.y,
    };
    this.resizeStartQuadrant =
    {
      left: x < midX,
      top: y < midY,
    };
  }
  private makeResizeHandles(directions: Direction[] | "all" = "all"): React.ReactElement<PopupResizeHandleProps>[]
  {
    const directionsToCreate: Direction[] = directions === "all" ?
      ["n", "e", "w", "s", "ne", "se", "sw", "nw"] :
      directions.slice(0);

    return directionsToCreate.map(direction =>
    {
      return PopupResizeHandle(
      {
        handleResizeMove: this.handleResizeMove,
        handleResizeStart: this.handleResizeStart,
        direction: direction,
        key: direction,
      });
    });
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(PopupComponent);
export default Factory;
