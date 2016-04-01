/// <reference path="playermoney.ts" />
/// <reference path="topbarresources.ts" />
/// <reference path="../playerflag.ts" />

export interface PropTypes
{
  // TODO refactor | add prop types
}

export default class TopBar extends React.Component<PropTypes, {}>
{
  displayName: "TopBar";
  updateListener: undefined;

  componentDidMount: function()
  {
    this.updateListener = eventManager.addEventListener(
      "builtBuildingWithEffect_income", this.forceUpdate.bind(this));
  }

  componentWillUnmount: function()
  {
    eventManager.removeEventListener("builtBuildingWithEffect_income", this.updateListener);
  }

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
}
