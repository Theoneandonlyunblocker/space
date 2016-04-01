/// <reference path="../../player.ts" />

/// <reference path="tradeableitemslist.ts" />

export interface PropTypes
{
  tradeableItems: reactTypeTODO_object; // ITradeableItems

  availableItems?: reactTypeTODO_object;
  header?: string;
  noListHeader?: boolean;
  onMouseUp?: reactTypeTODO_func;
  onDragStart?: reactTypeTODO_func;
  onDragEnd?: reactTypeTODO_func;
  hasDragItem?: boolean;
  isInvalidDropTarget?: boolean;
  onItemClick?: reactTypeTODO_func;
  adjustItemAmount?: reactTypeTODO_func;
}

export var TradeableItems = React.createFactory(React.createClass(
{
  displayName: "TradeableItems",
  mixins: [DropTarget],

  propTypes:
  {
    tradeableItems: React.PropTypes.object.isRequired, // ITradeableItems
    availableItems: React.PropTypes.object,
    header: React.PropTypes.string,
    noListHeader: React.PropTypes.bool,
    onMouseUp: React.PropTypes.func,
    onDragStart: React.PropTypes.func,
    onDragEnd: React.PropTypes.func,
    hasDragItem: React.PropTypes.bool,
    isInvalidDropTarget: React.PropTypes.bool,
    onItemClick: React.PropTypes.func,
    adjustItemAmount: React.PropTypes.func
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
        UIComponents.TradeableItemsList(
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
}));
