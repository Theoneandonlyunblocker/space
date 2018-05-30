import * as React from "react";

import Player from "../../Player";
import eventManager from "../../eventManager";

import {localize} from "../../../localization/localize";


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
      React.DOM.div(
      {
        className: "player-money",
      },
        `${localize("money")()} ${this.props.player.money}`,
      )
    );
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(PlayerMoneyComponent);
export default factory;
