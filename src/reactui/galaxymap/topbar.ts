module Rance
{
  export module UIComponents
  {
    export var TopBar = React.createClass(
    {
      displayName: "TopBar",
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
              className: "top-bar-player"
            },
              React.DOM.img(
              {
                className: "top-bar-player-icon",
                src: player.icon
              }),
              React.DOM.div(
              {
                className: "top-bar-player-name"
              }, player.name)
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
