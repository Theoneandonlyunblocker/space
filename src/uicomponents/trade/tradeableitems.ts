/// <reference path="../../player.ts" />

/// <reference path="tradeableitemslist.ts" />

module Rance
{
  export module UIComponents
  {
    export var TradeableItems = React.createClass(
    {
      displayName: "TradeableItems",
      mixins: [DropTarget],

      propTypes:
      {
        availableItems: React.PropTypes.object.isRequired, // ITradeableItems
        header: React.PropTypes.string,
        noListHeader: React.PropTypes.bool,
        onMouseUp: React.PropTypes.func,
        onDragStart: React.PropTypes.func,
        onDragEnd: React.PropTypes.func,
        hasDragItem: React.PropTypes.bool
      },

      handleMouseUp: function()
      {
        this.props.onMouseUp();
      },

      render: function()
      {
        var divProps: any =
        {
          className: "tradeable-items"
        };

        if (this.props.onMouseUp)
        {
          divProps.onMouseUp = this.handleMouseUp;
        }
        else if (this.props.hasDragItem)
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
            UIComponents.TradeableItemsList(
            {
              availableItems: this.props.availableItems,
              noListHeader: this.props.noListHeader,
              onDragStart: this.props.onDragStart,
              onDragEnd: this.props.onDragEnd
            })
          )
        );
      }
    })
  }
}
