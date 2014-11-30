module Rance
{
  export module UIComponents
  {
    export var TopBar = React.createClass({

      render: function()
      {
        var player: Player = this.props.player;

        var income = player.getIncome();

        var incomeClass = "top-bar-money-income";
        if (income < 0) incomeClass += " negative";
        
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
                className: incomeClass
              },
                "(+" + player.getIncome() + ")"
              )
            )
            
          )
        );
      }
    });
  }
}
