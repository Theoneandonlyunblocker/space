/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../mixins/droptarget.ts"/>

/// <reference path="unititem.ts"/>

export interface PropTypes
{
  // TODO refactor | add prop types
}

interface StateType
{
  // TODO refactor | add state type
}

class UnitItemWrapper extends React.Component<PropTypes, StateType>
{
  displayName: string = "UnitItemWrapper";
  mixins: reactTypeTODO_any = [DropTarget];

  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  handleMouseUp()
  {
    this.props.onMouseUp(this.props.slot);
  }

  render()
  {
    var item = this.props.item;

    var wrapperProps: any =
    {
      className: "unit-item-wrapper"
    };

    // if this is declared inside the conditional block
    // the component won't accept the first drop properly
    if (this.props.onMouseUp)
    {
      wrapperProps.onMouseUp = this.handleMouseUp
    };

    if (this.props.currentDragItem)
    {
      var dragItem = this.props.currentDragItem;
      if (dragItem.template.slot === this.props.slot)
      {
        wrapperProps.className += " drop-target";
      }
      else
      {
        wrapperProps.onMouseUp = null;
        wrapperProps.className += " invalid-drop-target";
      }
    }
    
    return(
      React.DOM.div(wrapperProps,
        UIComponents.UnitItem(
        {
          item: this.props.item,
          slot: this.props.slot,
          key: "item",

          isDraggable: this.props.isDraggable,
          onDragStart: this.props.onDragStart,
          onDragEnd: this.props.onDragEnd
        })
      )
    );
  }
}
