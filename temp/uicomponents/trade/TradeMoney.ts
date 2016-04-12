/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

interface PropTypes extends React.Props<any>
{
  keyTODO: string;
  moneyAmount: number;
  title: string;
  maxMoneyAvailable?: number;
  onDragStart?: reactTypeTODO_func;
  onDragEnd?: reactTypeTODO_func;
  onClick?: reactTypeTODO_func;
  adjustItemAmount?: reactTypeTODO_func;
}

interface StateType
{
  dragging?: boolean;
}

export class TradeMoneyComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "TradeMoney";
  mixins: reactTypeTODO_any = [Draggable];


  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
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

  handleMoneyAmountChange(e: Event)
  {
    var target = <HTMLInputElement> e.target;
    var value = parseInt(target.value);

    this.props.adjustItemAmount(this.props.keyTODO/*TODO react*/, value);
  }

  captureEvent(e: MouseEvent)
  {
    e.stopPropagation();
  }

  render()
  {
    var rowProps: any =
    {
      className: "tradeable-items-list-item"
    };

    if (this.props.onDragStart)
    {
      rowProps.className += " draggable";
      rowProps.onMouseDown = rowProps.onTouchStart = this.handleMouseDown;
    }

    if (this.state.dragging)
    {
      rowProps.style = this.dragPos;
      rowProps.className += " dragging";
    }
    else if (this.props.onClick)
    {
      rowProps.onClick = this.handleClick;
    }
    
    var moneyElement: React.HTMLElement;

    if (this.props.adjustItemAmount)
    {
      var moneyProps: any =
      {
        className: "trade-money-money-available trade-item-adjust",
        type: "number",
        min: 0,
        max: this.props.maxMoneyAvailable,
        step: 1,
        value: this.props.moneyAmount,
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
