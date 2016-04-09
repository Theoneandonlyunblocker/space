/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../mixins/draggable.ts" />
/// <reference path="resizehandle.ts" />

export interface PropTypes
{
  initialPosition?: reactTypeTODO_object;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  contentConstructor: reactTypeTODO_element; // React.PropTypes.element

  contentProps: reactTypeTODO_object;
  closePopup: reactTypeTODO_func;
  incrementZIndex: reactTypeTODO_func;
  getInitialPosition: reactTypeTODO_func;
  finishedMountingCallback?: reactTypeTODO_func;
}

export default class Popup extends React.Component<PropTypes, {}>
{
  displayName: string = "Popup";
  mixins: reactTypeTODO_any = [Draggable];


  state:
  {
    
  }

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  private getInitialState()
  {
    return(
    {
      zIndex: -1
    });
  }

  componentDidMount()
  {
    this.setInitialPosition();
  }

  onMouseDown(e: MouseEvent)
  {
    this.handleMouseDown(e);
    var newZIndex = this.props.incrementZIndex(this.state.zIndex);
    if (this.state.zIndex !== newZIndex)
    {
      this.setState(
      {
        zIndex: this.props.incrementZIndex(this.state.zIndex)
      });
    }
  }

  setInitialPosition()
  {
    var domRect = this.getDOMNode().getBoundingClientRect();
    var rect =
    {
      top: domRect.top,
      left: domRect.left,
      width: domRect.width,
      height: domRect.height
    };
    var left: number;
    var top: number;

    var container = this.containerElement; // set in draggable mixin
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
      var position = this.props.getInitialPosition(rect, container);
      
      left = position.left;
      top = position.top;
    }

    left = clamp(left, 0, container.offsetWidth - rect.width);
    top = clamp(top, 0, container.offsetHeight - rect.height);

    this.dragPos.top = top;
    this.dragPos.left = left;
    this.dragPos.width = Math.min(window.innerWidth, rect.width);
    this.dragPos.height = Math.min(window.innerHeight, rect.height);
    this.setState(
    {
      zIndex: this.props.incrementZIndex(this.state.zIndex)
    }, this.props.finishedMountingCallback);
  }

  handleResizeMove(x: number, y: number)
  {
    var minWidth = this.props.minWidth || 0;
    var maxWidth = this.props.maxWidth || window.innerWidth;
    var minHeight = this.props.minHeight || 0;
    var maxHeight = this.props.maxHeight || window.innerHeight;

    this.dragPos.width = clamp(x + 5 - this.dragPos.left, minWidth, maxWidth);
    this.dragPos.height = clamp(y + 5 - this.dragPos.top, minHeight, maxHeight);
    this.updateDOMNodeStyle();
    eventManager.dispatchEvent("popupResized");
  }

  render()
  {
    var divProps: any =
    {
      className: "popup draggable-container",
      onTouchStart: this.onMouseDown,
      onMouseDown: this.onMouseDown,
      style:
      {
        top: this.dragPos ? this.dragPos.top : 0,
        left: this.dragPos ? this.dragPos.left : 0,
        width: this.dragPos.width,
        height: this.dragPos.height,
        zIndex: this.state.zIndex,
        minWidth: this.props.minWidth,
        minHeight: this.props.minHeight
      }
    };

    if (this.state.dragging)
    {
      divProps.className += " dragging";
    }

    var contentProps = this.props.contentProps;

    contentProps.closePopup = this.props.closePopup
    contentProps.ref = "content";

    var resizeHandle = !this.props.resizable ? null : UIComponents.PopupResizeHandle(
    {
      handleResize: this.handleResizeMove
    });

    return(
      React.DOM.div(divProps,
        this.props.contentConstructor(contentProps),
        resizeHandle
      )
    );
  }
}
