import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {TradeableItems as TradeableItemsObj} from "../../../../src/trade/Trade";

import {TradeableItemsList} from "./TradeableItemsList";


export interface PropTypes extends React.Props<any>
{
  tradeableItems: TradeableItemsObj;

  availableItems?: TradeableItemsObj;
  header?: string;
  onMouseUp: () => void;
  onDragStart: (tradeableItemKey: string) => void;
  onDragEnd: () => void;
  isInvalidDropTarget: boolean;
  onItemClick: (tradeableItemKey: string) => void;
  adjustItemAmount?: (tradeableItemKey: string, newAmount: number) => void;
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

    this.bindMethods();
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
        TradeableItemsList(
        {
          tradeableItems: this.props.tradeableItems,
          availableItems: this.props.availableItems,
          onDragStart: this.props.onDragStart,
          onDragEnd: this.props.onDragEnd,
          onItemClick: this.props.onItemClick,
          adjustItemAmount: this.props.adjustItemAmount,
        }),
      )
    );
  }
}

export const TradeableItems: React.Factory<PropTypes> = React.createFactory(TradeableItemsComponent);
