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

        return(
          React.DOM.div({className: "buy-items"},
            UIComponents.ItemList(
            {
              items: player.getAllBuildableItems(),
              isDraggable: false,
              onRowChange: this.handleSelectRow
            })
          )
        );
      }
    });
  }
}