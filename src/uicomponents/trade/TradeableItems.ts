import * as React from "react";

import {TradeableItems} from "../../Trade";
import TradeableItemsList from "./TradeableItemsList";

export interface PropTypes extends React.Props<any>
{
  tradeableItems: TradeableItems;

  availableItems?: TradeableItems;
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
  displayName: string = "TradeableItems";
  state: StateType;

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
    this.props.onMouseUp!();
  }

  render()
  {
    const divProps: React.HTMLAttributes<HTMLDivElement> =
    {
      className: "tradeable-items",
    };

    if (this.props.onMouseUp)
    {
      divProps.onMouseUp = this.handleMouseUp;
    }
    if (this.props.isInvalidDropTarget)
    {
      divProps.className += " invalid-drop-target";
    }

    return(
      React.DOM.div(divProps,
        !this.props.header ? null : React.DOM.div(
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

const Factory: React.Factory<PropTypes> = React.createFactory(TradeableItemsComponent);
export default Factory;
