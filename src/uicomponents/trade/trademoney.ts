module Rance
{
  export module UIComponents
  {
    export var TradeMoney = React.createClass(
    {
      displayName: "TradeMoney",
      mixins: [Draggable],

      propTypes:
      {
        key: React.PropTypes.string.isRequired,
        moneyAmount: React.PropTypes.number.isRequired,
        title: React.PropTypes.string.isRequired,
        maxMoneyAvailable: React.PropTypes.number,
        onDragStart: React.PropTypes.func,
        onDragEnd: React.PropTypes.func,
        onClick: React.PropTypes.func,
        adjustItemAmount: React.PropTypes.func
      },

      onDragStart: function()
      {
        this.props.onDragStart(this.props.key);
      },

      onDragEnd: function()
      {
        this.props.onDragEnd();
      },

      handleClick: function()
      {
        this.props.onClick(this.props.key);
      },

      handleMoneyAmountChange: function(e: Event)
      {
        var target = <HTMLInputElement> e.target;
        var value = parseInt(target.value);

        this.props.adjustItemAmount(this.props.key, value);
      },

      captureEvent: function(e: MouseEvent)
      {
        e.stopPropagation();
      },

      render: function()
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
        
        var moneyElement: ReactDOMPlaceHolder;

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
    })
  }
}
