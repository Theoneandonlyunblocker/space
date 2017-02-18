/// <reference path="../../../lib/react-global.d.ts" />


import eventManager from "../../eventManager";
import {clamp} from "../../utility";
import PopupResizeHandle from "./PopupResizeHandle";

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

  ref_TODO_content: ContentComponent;

  constructor(props: PropTypes)
  {
    super(props);

    this.state = this.getInitialStateTODO();

    this.bindMethods();

    this.dragPositioner = new DragPositioner(this, this.props.dragPositionerProps);
    applyMixins(this, this.dragPositioner);
  }
  private bindMethods()
  {
    this.onMouseDown = this.onMouseDown.bind(this);
    this.handleResizeMove = this.handleResizeMove.bind(this);
    this.setInitialPosition = this.setInitialPosition.bind(this);
  }

  private getInitialStateTODO(): StateType
  {
    return(
    {
      zIndex: -1,
    });
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

  handleResizeMove(x: number, y: number)
  {
    const minWidth = this.props.minWidth || 0;
    const maxWidth = this.props.maxWidth || window.innerWidth;
    const minHeight = this.props.minHeight || 0;
    const maxHeight = this.props.maxHeight || window.innerHeight;

    this.dragPositioner.dragSize.x = clamp(x + 5 - this.dragPositioner.dragPos.x, minWidth, maxWidth);
    this.dragPositioner.dragSize.y = clamp(y + 5 - this.dragPositioner.dragPos.y, minHeight, maxHeight);
    this.dragPositioner.updateDOMNodeStyle();
    eventManager.dispatchEvent("popupResized");
  }

  render()
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

    const resizeHandle = !this.props.resizable ? null : PopupResizeHandle(
    {
      handleResize: this.handleResizeMove,
    });

    return(
      React.DOM.div(divProps,
        React.cloneElement(this.props.content, contentProps),
        resizeHandle,
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(PopupComponent);
export default Factory;
