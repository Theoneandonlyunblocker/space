/// <reference path="../../player.ts" />

export interface PropTypes
{
  player?: Player;
}

export default class PlayerMoney extends React.Component<PropTypes, {}>
{
  displayName: string = "PlayerMoney";
  lastAmountRendered: reactTypeTODO_any = undefined;


  componentDidMount: function()
  {
    eventManager.addEventListener("playerMoneyUpdated", this.handlePlayerMoneyUpdated);
  }

  componentWillUnmount: function()
  {
    eventManager.removeEventListener("playerMoneyUpdated", this.handlePlayerMoneyUpdated);
  }

  handlePlayerMoneyUpdated: function()
  {
    if (this.props.player.money !== this.lastAmountRendered)
    {
      this.forceUpdate();
    }
  }

  render: function()
  {
    this.lastAmountRendered = this.props.player.money;

    return(
      React.DOM.div(
      {
        className: "player-money"
      },
        "Money: " + this.props.player.money
      )
    );
  }
}
