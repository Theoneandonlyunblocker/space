/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

import TradeableItemsList from "./TradeableItemsList";
import {TradeableItems} from "../../Trade";

interface PropTypes extends React.Props<any>
{
  tradeableItems: TradeableItems; // TODO refactor | rename -> staged items

  availableItems?: TradeableItems;
  header?: string;
  noListHeader?: boolean;
  onMouseUp?: () => void;
  onDragStart?: (tradeableItemKey: string) => void;
  onDragEnd?: () => void;
  hasDragItem?: boolean;
  isInvalidDropTarget?: boolean;
  onItemClick?: (tradeableItemKey: string) => void;
  adjustItemAmount?: (tradeableItemKey: string, newAmount: number) => void;
}

interface StateType
{
}

export class TradeableItemsComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "TradeableItems";
  mixins: reactTypeTODO_any = [DropTarget];


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
    this.props.onMouseUp();
  }

  render()
  {
    var divProps: React.HTMLAttributes =
    {
      className: "tradeable-items"
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
          className: "tradeable-items-header"
        },
          this.props.header
        ),
        TradeableItemsList(
        {
          tradeableItems: this.props.tradeableItems,
          availableItems: this.props.availableItems,
          noListHeader: this.props.noListHeader,
          onDragStart: this.props.onDragStart,
          onDragEnd: this.props.onDragEnd,
          onItemClick: this.props.onItemClick,
          adjustItemAmount: this.props.adjustItemAmount
        })
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(TradeableItemsComponent);
export default Factory;
