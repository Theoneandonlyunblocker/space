module Rance
{
  export module UIComponents
  {
    export var BuyItems = React.createClass(
    {
      displayName: "BuyItems",

      handleSelectRow: function(row)
      {
        var item = row.data.item;
        
        this.props.player.addItem(item);
      },

      render: function()
      {
        var player = this.props.player;
        var items = player.getAllBuildableItems();

        if (items.length < 1)
        {
          return(
            React.DOM.div({className: "buy-items"},
              "You need to construct an item manufactory first"
            )
          );
        }

        return(
          React.DOM.div({className: "buy-items"},
            UIComponents.ItemList(
            {
              items: items,
              isDraggable: false,
              onRowChange: this.handleSelectRow,
              isItemPurchaseList: true
            })
          )
        );
      }
    });
  }
}