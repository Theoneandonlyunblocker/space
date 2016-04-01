/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../mixins/draggable.ts" />

export interface PropTypes
{
  // TODO refactor | add prop types
}

export default class PopupResizeHandle extends React.Component<PropTypes, {}>
{
  displayName: string = "PopupResizeHandle";
  mixins: reactTypeTODO_any = [Draggable];

  // originBottom: reactTypeTODO_any = undefined;
  // originRight: reactTypeTODO_any = undefined;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
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

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
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
