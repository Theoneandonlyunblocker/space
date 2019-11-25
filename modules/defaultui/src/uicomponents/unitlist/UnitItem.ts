import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {DragPositioner, DragPositionerProps} from "../mixins/DragPositioner";
import {applyMixins} from "../mixins/applyMixins";

import {Item} from "core/src/items/Item";
import * as debug from "core/src/app/debug";

import {localize} from "../../../localization/localize";
import { ItemIcon } from "./ItemIcon";
import { ItemTemplate } from "core/src/templateinterfaces/ItemTemplate";


export interface PropTypes<T extends ItemTemplate | Item> extends React.Props<any>
{
  item: T;
  slot: string;

  isDraggable: boolean;
  onDragEnd?: (dropSuccessful?: boolean) => void;
  onDragStart?: (item: T) => void;
  dragPositionerProps?: DragPositionerProps;
}

interface StateType
{
}

export class UnitItemComponent<T extends ItemTemplate | Item> extends React.Component<PropTypes<T>, StateType>
{
  public displayName = "UnitItem";
  public state: StateType;

  dragPositioner: DragPositioner<UnitItemComponent<T>>;
  private readonly ownDOMNode = React.createRef<HTMLDivElement>();

  constructor(props: PropTypes<T>)
  {
    super(props);

    this.onDragEnd = this.onDragEnd.bind(this);
    this.onDragStart = this.onDragStart.bind(this);

    this.dragPositioner = new DragPositioner(this, this.ownDOMNode, this.props.dragPositionerProps);
    this.dragPositioner.onDragStart = this.onDragStart;
    this.dragPositioner.onDragEnd = this.onDragEnd;
    applyMixins(this, this.dragPositioner);
  }

  public render()
  {
    if (!this.props.item)
    {
      return ReactDOMElements.div(
      {
        className: "empty-unit-item",
        title: localize("itemSlot").format(this.props.slot),
        ref: this.ownDOMNode,
      });
    }

    const itemTemplate = this.getItemTemplate();

    const divProps: React.HTMLAttributes<HTMLDivElement> & React.ClassAttributes<HTMLDivElement> =
    {
      className: "unit-item",
      title: itemTemplate.displayName,
      ref: this.ownDOMNode,
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
      ReactDOMElements.div(divProps,
        ItemIcon({itemTemplate: itemTemplate}),
      )
    );
  }

  private onDragStart(): void
  {
    debug.log("ui", `Start item drag ´${this.getItemTemplate().displayName}`);
    this.props.onDragStart(this.props.item);
  }
  private onDragEnd(): void
  {
    debug.log("ui", `End item drag ´${this.getItemTemplate().displayName}`);
    this.props.onDragEnd();
  }
  private getItemTemplate(): ItemTemplate
  {
    if (UnitItemComponent.itemIsTemplate(this.props.item))
    {
      return this.props.item;
    }
    else
    {
      return (this.props.item as Item).template;
    }
  }

  private static itemIsTemplate(item: Item | ItemTemplate): item is ItemTemplate
  {
    return !Boolean((item as Item).template);
  }
}

const factory: any = React.createFactory(UnitItemComponent);
export function UnitItem<T extends ItemTemplate | Item>(props?: React.Attributes & PropTypes<T>, ...children: React.ReactNode[]): React.ReactElement<PropTypes<T>>
{
  return factory(props, ...children);
}
