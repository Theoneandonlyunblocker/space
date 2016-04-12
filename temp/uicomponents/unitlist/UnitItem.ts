/// <reference path="../../../lib/react-0.13.3.d.ts" />


import Item from "../../../src/Item.ts";

import * as React from "react";

interface PropTypes extends React.Props<any>
{
  onDragEnd: any; // TODO refactor | define prop type 123
  onDragStart: any; // TODO refactor | define prop type 123
  item: Item;
  isDraggable: boolean;
  slot: any; // TODO refactor | define prop type 123
}

interface StateType
{
  dragging?: any; // TODO refactor | define state type 456
}

export class UnitItemComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "UnitItem";
  mixins: reactTypeTODO_any = [Draggable];

  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.onDragEnd = this.onDragEnd.bind(this);
    this.getTechIcon = this.getTechIcon.bind(this);
    this.onDragStart = this.onDragStart.bind(this);    
  }
  
  onDragStart()
  {
    this.props.onDragStart(this.props.item);
  }
  onDragEnd()
  {
    this.props.onDragEnd();
  }
  getTechIcon(techLevel: number)
  {
    switch (techLevel)
    {
      case 2:
      {
        return "img\/icons\/t2icon.png"
      }
      case 3:
      {
        return "img\/icons\/t3icon.png"
      }
    }
  }

  render()
  {
    if (!this.props.item)
    {
      var emptyItemTitle = "Item slot: " + this.props.slot;
      return(
        React.DOM.div({className: "empty-unit-item", title: emptyItemTitle})
      );

    }
    var item = this.props.item;

    var divProps: any =
    {
      className: "unit-item",
      title: item.template.displayName
    };
    
    if (this.props.isDraggable)
    {
      divProps.className += " draggable";
      divProps.onMouseDown = divProps.onTouchStart =
        this.handleMouseDown;
    }

    if (this.state.dragging)
    {
      divProps.style = this.dragPos;
      divProps.className += " dragging";
    }

    return(
      React.DOM.div(divProps,
        React.DOM.div(
        {
          className: "item-icon-container"
        },
          React.DOM.img(
          {
            className: "item-icon-base",
            src: item.template.icon
          }),
          item.template.techLevel > 1 ? React.DOM.img(
          {
            className: "item-icon-tech-level",
            src: this.getTechIcon(item.template.techLevel)
          }) : null
        )
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(UnitItemComponent);
export default Factory;
