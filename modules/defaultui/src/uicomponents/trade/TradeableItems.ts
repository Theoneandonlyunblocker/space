import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {TradeableItems as TradeableItemsObj} from "core/src/trade/Trade";

import { Collapsible } from "../generic/Collapsible";
import { ResourceList } from "../resources/ResourceList";
import { TradeResource } from "./TradeResource";


export interface PropTypes extends React.Props<any>
{
  tradeableItems: TradeableItemsObj;

  availableItems?: TradeableItemsObj;
  header?: string;
  onMouseUp: () => void;
  onDragStart: (tradeableItemCategory: keyof TradeableItemsObj, tradeableItemKey: string) => void;
  onDragEnd: () => void;
  isInvalidDropTarget: boolean;
  onItemClick: (tradeableItemCategory: keyof TradeableItemsObj, tradeableItemKey: string) => void;
  adjustItemAmount?: (tradeableItemCategory: keyof TradeableItemsObj, tradeableItemKey: string, newAmount: number) => void;
  shouldGroupCategories: boolean;
}

interface StateType
{
}

export class TradeableItemsComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "TradeableItems";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  public render()
  {
    const divProps: React.HTMLAttributes<HTMLDivElement> =
    {
      className: "tradeable-items",
    };

    if (this.props.isInvalidDropTarget)
    {
      divProps.className += " invalid-drop-target";
    }
    else if (this.props.onMouseUp)
    {
      divProps.onMouseUp = this.handleMouseUp;
    }

    return(
      ReactDOMElements.div(divProps,
        !this.props.header ? null : ReactDOMElements.div(
        {
          className: "tradeable-items-header",
        },
          this.props.header,
        ),
        this.renderTradeableItemsGroup("Resources",
          ResourceList(
          {
            resourceTypes: Object.keys(this.props.tradeableItems.resources),
            renderResource: resource => TradeResource(
            {
              key: resource.type,
              resource: resource,
              amount: this.props.tradeableItems.resources[resource.type].amount,
              maxAvailable: this.props.availableItems ?
                this.props.availableItems.resources[resource.type].amount :
                undefined,
              onClick: () => this.props.onItemClick("resources", resource.type),
              onDragStart: () => this.props.onDragStart("resources", resource.type),
              onDragEnd: () => this.props.onDragEnd(),
              adjustAmount: this.props.adjustItemAmount ?
                amount => this.props.adjustItemAmount("resources", resource.type, amount) :
                undefined,
            }),
          }),
        )
      )
    );
  }

  private renderTradeableItemsGroup(title: string, group: React.ReactElement<any>): React.ReactElement<any>
  {
    if (this.props.shouldGroupCategories)
    {
      return Collapsible({title: title}, group);
    }
    else
    {
      return group;
    }
  }
  private handleMouseUp()
  {
    this.props.onMouseUp();
  }
}

export const TradeableItems: React.Factory<PropTypes> = React.createFactory(TradeableItemsComponent);
