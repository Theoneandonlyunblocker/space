import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {Item} from "src/items/Item";

import {UnitItem} from "./UnitItem";


export interface PropTypes extends React.Props<any>
{
  item: Item;
  onMouseUp: (index: number) => void;
  slot: string;
  index: number;
  currentDragItem: Item;

  isDraggable: boolean;
  onDragStart: (item: Item) => void;
  onDragEnd: (dropSuccessful?: boolean) => void;
}

interface StateType
{
}

export class UnitItemWrapperComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "UnitItemWrapper";
  public state: StateType;

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
    this.props.onMouseUp(this.props.index);
  }

  render()
  {
    const wrapperProps: React.HTMLAttributes<HTMLDivElement> =
    {
      className: "unit-item-wrapper",
    };

    // if this is declared inside the conditional block
    // the component won't accept the first drop properly
    if (this.props.onMouseUp)
    {
      wrapperProps.onMouseUp = this.handleMouseUp;
    }

    if (this.props.currentDragItem)
    {
      const dragItem = this.props.currentDragItem;
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
      ReactDOMElements.div(wrapperProps,
        UnitItem(
        {
          item: this.props.item,
          slot: this.props.slot,
          key: "item",

          isDraggable: this.props.isDraggable,
          onDragStart: this.props.onDragStart,
          onDragEnd: this.props.onDragEnd,
        }),
      )
    );
  }
}

export const UnitItemWrapper: React.Factory<PropTypes> = React.createFactory(UnitItemWrapperComponent);
