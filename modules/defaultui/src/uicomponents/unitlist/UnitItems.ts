import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import { Item } from "core/src/items/Item";
import { ItemTemplate } from "core/src/templateinterfaces/ItemTemplate";
import { UnitItemWrapper } from "./UnitItemWrapper";


// tslint:disable-next-line:no-any
export interface PropTypes<T extends ItemTemplate | Item> extends React.Props<any>
{
  itemsBySlot: {[itemSlot: string]: (T | undefined)[]};

  isDraggable?: boolean;
  currentDragItem?: T;
  onDragStart?: (item: T) => void;
  onDragEnd?: (dropSuccessful?: boolean) => void;
  onMouseUp?: (index: number) => void;

  onClick?: (slot: string, index: number) => void;
}

const UnitItemsComponent = <T extends ItemTemplate | Item>(props: PropTypes<T>) =>
{
  return(
    ReactDOMElements.div(
    {
      className: "unit-items",
    },
      Object.keys(props.itemsBySlot).map(itemSlot =>
      {
        const items: T[] = props.itemsBySlot[itemSlot];

        return ReactDOMElements.div(
        {
          key: itemSlot,
          className: `unit-item-group unit-item-group-${itemSlot}`,
        },
          items.map((item, i) =>
          {
            return UnitItemWrapper(
            {
              key: i,
              slot: itemSlot,
              item: item,
              index: i,

              onMouseUp: props.onMouseUp ?
                () => props.onMouseUp(i) :
                undefined,
              isDraggable: props.isDraggable,
              onDragStart: props.onDragStart,
              onDragEnd: props.onDragEnd,
              currentDragItem: props.currentDragItem,

              onClick: props.onClick ?
                () => props.onClick(itemSlot, i) :
                undefined,
            });
          }),
        );
      }),
    )
  );
};

export function UnitItems<T extends ItemTemplate | Item>(props?: React.Attributes & PropTypes<T>, ...children: React.ReactNode[]): React.ReactElement<PropTypes<T>>
{
  return React.createElement(UnitItemsComponent, props, ...children);
}
