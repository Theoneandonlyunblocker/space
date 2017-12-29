import * as React from "react";

import Item from "../../Item";
import UnitItemWrapper from "./UnitItemWrapper";

interface PropTypes extends React.Props<any>
{
  slotName: string;
  maxItems: number;
  items: Item[];

  isDraggable?: boolean;
  onDragEnd?: (dropSuccessful?: boolean) => void;
  onDragStart?: (item: Item) => void;
  onMouseUp?: (index: number) => void;
  currentDragItem?: Item;
}

interface StateType
{
}

export class UnitItemGroupComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "UnitItemGroup";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  render()
  {
    const itemWrappers: React.ReactElement<any>[] = [];
    const itemsByPosition: {[position: number]: Item} = {};

    this.props.items.forEach(item =>
    {
      itemsByPosition[item.positionInUnit] = item;
    });

    for (let i = 0; i < this.props.maxItems; i++)
    {
      itemWrappers.push(
        UnitItemWrapper(
        {
          key: i,
          slot: this.props.slotName,
          item: itemsByPosition[i],
          index: i,

          onMouseUp: this.props.onMouseUp,
          isDraggable: this.props.isDraggable,
          onDragStart: this.props.onDragStart,
          onDragEnd: this.props.onDragEnd,
          currentDragItem: this.props.currentDragItem,
        }),
      );
    }

    return(
      React.DOM.div(
      {
        className: "unit-item-group unit-item-group-" + this.props.slotName,
      },
        itemWrappers,
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(UnitItemGroupComponent);
export default Factory;
