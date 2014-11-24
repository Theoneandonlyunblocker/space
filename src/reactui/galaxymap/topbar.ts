module Rance
{
  export module UIComponents
  {
    export var TopBar = React.createClass({

      render: function()
      {
        var player: Player = this.props.player;

        
        return(
          React.DOM.div(
          {
            className: "top-bar"
          },
            React.DOM.div(
            {
              className: "top-bar-name"
            },
              player.name
            ),
            React.DOM.div(
            {
              className: "top-bar-money"
            },
              React.DOM.div(
              {
                className: "top-bar-money-current"
              },
                "Money: " + player.money
              ),
              React.DOM.div(
              {
                className: "top-bar-money-income"
              },
                "+" + player.getIncome()
              )
            )
            
          )
        );
      }
    });
  }
}
