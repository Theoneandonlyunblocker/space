import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {default as DragPositioner, DragPositionerProps} from "../mixins/DragPositioner";
import applyMixins from "../mixins/applyMixins";

import TradeableItemProps from "./TradeableItemProps";


export interface PropTypes extends TradeableItemProps, React.Props<any>
{
  keyTODO: string;
  moneyAmount: number;
  title: string;
  maxMoneyAvailable?: number;
  onClick: (tradeableItemKey: string) => void;
  adjustItemAmount?: (tradeableItemKey: string, newAmount: number) => void;

  onDragStart: (tradeableItemKey: string) => void;
  onDragEnd: () => void;
  dragPositionerProps?: DragPositionerProps;
}

interface StateType
{
}

export class TradeMoneyComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "TradeMoney";
  public state: StateType;

  dragPositioner: DragPositioner<TradeMoneyComponent>;
  private readonly ownDOMNode = React.createRef<HTMLTableRowElement>();

  constructor(props: PropTypes)
  {
    super(props);

    this.bindMethods();

    this.dragPositioner = new DragPositioner(this, this.ownDOMNode, this.props.dragPositionerProps);
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

  handleMoneyAmountChange(e: React.FormEvent<HTMLInputElement>)
  {
    const target = e.currentTarget;
    const value = parseInt(target.value);

    this.props.adjustItemAmount!(this.props.keyTODO/*TODO react*/, value);
  }

  captureEvent(e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>)
  {
    e.stopPropagation();
  }

  render()
  {
    const rowProps: React.HTMLAttributes<HTMLTableRowElement> & React.ClassAttributes<HTMLTableRowElement> =
    {
      className: "tradeable-items-list-item",
      ref: this.ownDOMNode,
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

    if (this.props.onClick)
    {
      rowProps.onClick = this.handleClick;
    }

    let moneyElement: React.ReactHTMLElement<any>;

    if (this.props.adjustItemAmount)
    {
      const moneyProps: React.InputHTMLAttributes<HTMLInputElement> =
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
        onTouchStart: this.captureEvent,
      };

      moneyElement = ReactDOMElements.input(moneyProps);
    }
    else
    {
      moneyElement = ReactDOMElements.span(
      {
        className: "trade-money-money-available",
      },
        this.props.moneyAmount,
      );
    }


    return(
      ReactDOMElements.tr(rowProps,
        ReactDOMElements.td(null,
          ReactDOMElements.span(
          {
            className: "trade-money-title",
          },
            this.props.title,
          ),
          moneyElement,
        ),
      )
    );
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(TradeMoneyComponent);
export default factory;
