import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {Item} from "core/src/items/Item";

import {UnitItem} from "./UnitItem";
import { ItemTemplate } from "core/src/templateinterfaces/ItemTemplate";


export interface PropTypes<T extends ItemTemplate | Item> extends React.Props<any>
{
  item: T;
  onMouseUp: (index: number) => void;
  slot: string;
  index: number;
  currentDragItem: T;

  isDraggable: boolean;
  onDragStart: (item: T) => void;
  onDragEnd: (dropSuccessful?: boolean) => void;
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
