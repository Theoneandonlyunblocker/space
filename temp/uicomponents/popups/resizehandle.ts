/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../mixins/draggable.ts" />

export interface PropTypes
{
  // TODO refactor | add prop types
}

interface StateType
{
  // TODO refactor | add state type
}

export default class PopupResizeHandle extends React.Component<PropTypes, StateType>
{
  displayName: string = "PopupResizeHandle";
  mixins: reactTypeTODO_any = [Draggable];

  // originBottom: reactTypeTODO_any = undefined;
  // originRight: reactTypeTODO_any = undefined;

  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  // onDragStart()
  // {
  //   var rect = this.getDOMNode().getBoundingClientRect();
  //   this.originBottom = rect.bottom;
  //   this.originRight = rect.right;
  // }

  onDragMove(x: number, y: number)
  {
    var rect = this.getDOMNode().getBoundingClientRect();
    this.props.handleResize(x + rect.width, y + rect.height);
  }

  render()
  {
    return(
      React.DOM.img(
      {
        className: "popup-resize-handle",
        src: "img\/icons\/resizeHandle.png",
        onTouchStart: this.handleMouseDown,
        onMouseDown: this.handleMouseDown
      })
    );
  }
}
