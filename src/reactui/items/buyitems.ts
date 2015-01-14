/// <reference path="itempurchaselist.ts" />

module Rance
{
  export module UIComponents
  {
    export var BuyItems = React.createClass(
    {
      displayName: "BuyItems",

      handleSelectRow: function(row)
      {
        var template = row.data.item.template;
        var item = new Item(template);
        
        this.props.player.addItem(item);
        this.props.player.money -= template.cost;

        eventManager.dispatchEvent("playerControlUpdated");
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
            UIComponents.ItemPurchaseList(
            {
              items: items,
              onRowChange: this.handleSelectRow,
              playerMoney: this.props.player.money
            })
          )
        );
      }
    });
  }
}