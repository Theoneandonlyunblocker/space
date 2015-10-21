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
        moneyAvailable: React.PropTypes.number.isRequired,
        title: React.PropTypes.string.isRequired,
        onDragStart: React.PropTypes.func,
        onDragEnd: React.PropTypes.func
      },

      onDragStart: function()
      {
        this.props.onDragStart(this.props.key);
      },

      onDragEnd: function()
      {
        this.props.onDragEnd();
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

        return(
          React.DOM.tr(rowProps,
            React.DOM.td(null,
              React.DOM.span(
              {
                className: "trade-money-title"
              },
                this.props.title
              ),
              React.DOM.span(
              {
                className: "trade-money-money-available"
              },
                this.props.moneyAvailable
              )
            )
          )
        );
      }
    })
  }
}
