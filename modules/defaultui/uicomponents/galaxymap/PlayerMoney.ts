import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {Player} from "src/player/Player";
import {eventManager} from "src/app/eventManager";

import {localize} from "../../localization/localize";


export interface PropTypes extends React.Props<any>
{
  player?: Player;
}

interface StateType
{
}

export class PlayerMoneyComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "PlayerMoney";
  lastAmountRendered: number = undefined;


  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.bindMethods();
  }
  private bindMethods()
  {
    this.handlePlayerMoneyUpdated = this.handlePlayerMoneyUpdated.bind(this);
  }

  componentDidMount()
  {
    eventManager.addEventListener("playerMoneyUpdated", this.handlePlayerMoneyUpdated);
  }

  componentWillUnmount()
  {
    eventManager.removeEventListener("playerMoneyUpdated", this.handlePlayerMoneyUpdated);
  }

  handlePlayerMoneyUpdated()
  {
    if (this.props.player.money !== this.lastAmountRendered)
    {
      this.forceUpdate();
    }
  }

  render()
  {
    this.lastAmountRendered = this.props.player.money;

    return(
      ReactDOMElements.div(
      {
        className: "player-money",
      },
        `${localize("money")} ${this.props.player.money}`,
      )
    );
  }
}

export const PlayerMoney: React.Factory<PropTypes> = React.createFactory(PlayerMoneyComponent);
