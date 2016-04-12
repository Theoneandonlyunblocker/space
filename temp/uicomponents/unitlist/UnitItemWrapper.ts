/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../mixins/droptarget.ts"/>

/// <reference path="unititem.ts"/>


import UnitItem from "./UnitItem.ts";


export interface PropTypes extends React.Props<any>
{
  onDragEnd: any; // TODO refactor | define prop type 123
  item: any; // TODO refactor | define prop type 123
  onDragStart: any; // TODO refactor | define prop type 123
  onMouseUp: any; // TODO refactor | define prop type 123
  slot: any; // TODO refactor | define prop type 123
  currentDragItem: any; // TODO refactor | define prop type 123
  isDraggable: any; // TODO refactor | define prop type 123
}

interface StateType
{
}

export class UnitItemWrapper_COMPONENT_TODO extends React.Component<PropTypes, StateType>
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
    this.handleMouseUp = this.handleMouseUp.bind(this);    
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
        UnitItem(
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

const Factory: React.Factory<PropTypes> = React.createFactory(UnitItemWrapper_COMPONENT_TODO);
export default Factory;
