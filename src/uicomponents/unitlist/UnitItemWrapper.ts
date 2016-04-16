/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react/addons";

import UnitItem from "./UnitItem";
import Item from "../../Item";
import DropTarget from "../mixins/DropTarget";
import applyMixins from "../mixins/applyMixins";


interface PropTypes extends React.Props<any>
{
  onDragEnd: (dropSuccesful?: boolean) => void;
  item: Item;
  onDragStart: (item: Item) => void;
  onMouseUp: () => void;
  slot: string;
  currentDragItem: Item;
  isDraggable: boolean;
}

interface StateType
{
}

export class UnitItemWrapperComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "UnitItemWrapper";
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
    applyMixins(this, new DropTarget(this.handleMouseUp));
  }
  private bindMethods()
  {
    this.handleMouseUp = this.handleMouseUp.bind(this);    
  }
  
  handleMouseUp()
  {
    this.props.onMouseUp();
  }

  render()
  {
    var item = this.props.item;

    var wrapperProps: React.HTMLAttributes =
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

const Factory: React.Factory<PropTypes> = React.createFactory(UnitItemWrapperComponent);
export default Factory;
