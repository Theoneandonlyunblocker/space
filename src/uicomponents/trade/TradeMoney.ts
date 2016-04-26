/// <reference path="../../../lib/react-global.d.ts" />

import TradeableItemProps from "./TradeableItemProps";
import {default as DragPositioner, DragPositionerProps} from "../mixins/DragPositioner";
import applyMixins from "../mixins/applyMixins";

export interface PropTypes extends TradeableItemProps, React.Props<any>
{
  keyTODO: string;
  moneyAmount: number;
  title: string;
  maxMoneyAvailable?: number;
  onClick?: (tradeableItemKey: string) => void;
  adjustItemAmount?: (tradeableItemKey: string, newAmount: number) => void;
  
  onDragStart?: (tradeableItemKey: string) => void;
  onDragEnd?: () => void;
  dragPositionerProps?: DragPositionerProps;
}

interface StateType
{
}

export class TradeMoneyComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "TradeMoney";
  state: StateType;
  dragPositioner: DragPositioner<TradeMoneyComponent>;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
    
    this.dragPositioner = new DragPositioner(this, this.props.dragPositionerProps);
    this.dragPositioner.onDragStart = this.onDragStart;
    this.dragPositioner.onDragEnd = this.onDragEnd;
      applyMixins(this, this.dragPositioner);
  }
  private bindMethods()
  {
    this.handleClick = this.handleClick.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.captureEvent = this.captureEvent.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.handleMoneyAmountChange = this.handleMoneyAmountChange.bind(this);    
  }
  
  onDragStart()
  {
    this.props.onDragStart(this.props.keyTODO/*TODO react*/);
  }

  onDragEnd()
  {
    this.props.onDragEnd();
  }

  handleClick()
  {
    this.props.onClick(this.props.keyTODO/*TODO react*/);
  }

  handleMoneyAmountChange(e: React.FormEvent)
  {
    var target = <HTMLInputElement> e.target;
    var value = parseInt(target.value);

    this.props.adjustItemAmount(this.props.keyTODO/*TODO react*/, value);
  }

  captureEvent(e: React.MouseEvent | React.TouchEvent)
  {
    e.stopPropagation();
  }

  render()
  {
    var rowProps: React.HTMLAttributes =
    {
      className: "tradeable-items-list-item"
    };

    if (this.props.onDragStart)
    {
      rowProps.className += " draggable";
      rowProps.onMouseDown = rowProps.onTouchStart = this.dragPositioner.handleReactDownEvent;
      
      if (this.dragPositioner.isDragging)
      {
        rowProps.style = this.dragPositioner.getStyleAttributes();
        rowProps.className += " dragging";
      }
    }
    else if (this.props.onClick)
    {
      rowProps.onClick = this.handleClick;
    }
    
    var moneyElement: React.ReactHTMLElement<any>;

    if (this.props.adjustItemAmount)
    {
      var moneyProps: React.HTMLAttributes =
      {
        className: "trade-money-money-available trade-item-adjust",
        type: "number",
        min: 0,
        max: this.props.maxMoneyAvailable,
        step: 1,
        value: "" + this.props.moneyAmount,
        onChange: this.handleMoneyAmountChange,
        onClick: this.captureEvent,
        onMouseDown: this.captureEvent,
        onTouchStart: this.captureEvent
      };

      moneyElement = React.DOM.input(moneyProps);
    }
    else
    {
      moneyElement = React.DOM.span(
      {
        className: "trade-money-money-available"
      },
        this.props.moneyAmount
      );
    }


    return(
      React.DOM.tr(rowProps,
        React.DOM.td(null,
          React.DOM.span(
          {
            className: "trade-money-title"
          },
            this.props.title
          ),
          moneyElement
        )
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(TradeMoneyComponent);
export default Factory;
