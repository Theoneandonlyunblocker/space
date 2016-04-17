/// <reference path="../../../lib/react-global-0.13.3.d.ts" />

import {default as DragPositioner, DragPositionerProps} from "../mixins/DragPositioner";
import applyMixins from "../mixins/applyMixins";

import Item from "../../Item";


interface PropTypes extends React.Props<any>
{
  item: Item;
  slot: string;
  
  isDraggable: boolean;
  onDragEnd?: (dropSuccesful?: boolean) => void;
  onDragStart?: (item: Item) => void;
  dragPositionerProps?: DragPositionerProps;
}

interface StateType
{
}

export class UnitItemComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "UnitItem";
  state: StateType;
  dragPositioner: DragPositioner<UnitItemComponent>;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
    
    if (this.props.isDraggable)
    {
      this.dragPositioner = new DragPositioner(this, this.props.dragPositionerProps);
      this.dragPositioner.onDragStart = this.onDragStart;
      this.dragPositioner.onDragEnd = this.onDragEnd;
      applyMixins(this, this.dragPositioner);
    }
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
        return "img/icons/t2icon.png"
      }
      case 3:
      {
        return "img/icons/t3icon.png"
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

    var divProps: React.HTMLAttributes =
    {
      className: "unit-item",
      title: item.template.displayName
    };
    
    if (this.props.isDraggable)
    {
      divProps.className += " draggable";
      divProps.onMouseDown = divProps.onTouchStart =
        this.dragPositioner.handleReactDownEvent;

      if (this.dragPositioner.isDragging)
      {
        divProps.style = this.dragPositioner.getStyleAttributes();
        divProps.className += " dragging";
      }
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
