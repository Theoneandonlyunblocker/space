import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {Item} from "core/src/items/Item";

import {UnitItem} from "./UnitItem";
import { ItemTemplate } from "core/src/templateinterfaces/ItemTemplate";


export interface PropTypes<T extends ItemTemplate | Item> extends React.Props<any>
{
  item: T;
  slot: string;
  index: number;

  isDraggable?: boolean;
  currentDragItem?: T;
  onDragStart?: (item: T) => void;
  onDragEnd?: (dropSuccessful?: boolean) => void;
  onMouseUp?: () => void;

  onClick?: () => void;
  onRightClick?: () => void;
}

interface StateType
{
}

export class UnitItemWrapperComponent<T extends ItemTemplate | Item> extends React.Component<PropTypes<T>, StateType>
{
  public displayName = "UnitItemWrapper";
  public state: StateType;

  constructor(props: PropTypes<T>)
  {
    super(props);
  }

  public render()
  {
    const wrapperProps: React.HTMLAttributes<HTMLDivElement> =
    {
      className: "unit-item-wrapper",
      onMouseUp: this.props.onMouseUp,
      onClick: this.props.onClick,
      onContextMenu: !this.props.onRightClick ? null : (e) =>
      {
        e.preventDefault();
        this.props.onRightClick();
      },
    };

    if (this.props.currentDragItem)
    {
      const dragItem = this.props.currentDragItem;
      const template = UnitItemWrapperComponent.isItemTemplate(dragItem) ?
        dragItem :
        (dragItem as Item).template;

      if (template.slot === this.props.slot)
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

  private static isItemTemplate(item: Item | ItemTemplate): item is ItemTemplate
  {
    return !Boolean((item as Item).template);
  }
}

const factory: any = React.createFactory(UnitItemWrapperComponent);
export function UnitItemWrapper<T extends ItemTemplate | Item>(props?: React.Attributes & PropTypes<T>, ...children: React.ReactNode[]): React.ReactElement<PropTypes<T>>
{
  return factory(props, ...children);
}
