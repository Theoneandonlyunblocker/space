/// <reference path="playermoney.ts" />
/// <reference path="topbarresources.ts" />
/// <reference path="../playerflag.ts" />

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
              className: "top-bar-info"
            },
              React.DOM.div(
              {
                className: "top-bar-player"
              },
                UIComponents.PlayerFlag(
                {
                  props:
                  {
                    className: "top-bar-player-icon"
                  },
                  flag: player.flag
                }),
                React.DOM.div(
                {
                  className: "top-bar-turn-number"
                }, "Turn " + this.props.game.turnNumber)
              ),
              React.DOM.div(
              {
                className: "top-bar-money"
              },
                UIComponents.PlayerMoney(
                {
                  player: player
                }),
                React.DOM.div(
                {
                  className: incomeClass
                },
                  "(+" + player.getIncome() + ")"
                )
              ),
              UIComponents.TopBarResources(
              {
                player: player  
              })
            )
          )
        );
      }
    });
  }
}
