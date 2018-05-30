import * as React from "react";

import {localize} from "../../../localization/localize";
import Game from "../../Game";
import Player from "../../Player";
import eventManager from "../../eventManager";
import PlayerFlag from "../PlayerFlag";

import PlayerMoney from "./PlayerMoney";
import TopBarResources from "./TopBarResources";


export interface PropTypes extends React.Props<any>
{
  game: Game;
  player: Player;
}

interface StateType
{
}

export class TopBarComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "TopBar";
  updateListener: Function = undefined;

  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  componentDidMount()
  {
    this.updateListener = eventManager.addEventListener(
      "builtBuildingWithEffect_income", this.forceUpdate.bind(this));
  }

  componentWillUnmount()
  {
    eventManager.removeEventListener("builtBuildingWithEffect_income", this.updateListener);
  }

  render()
  {
    const player = this.props.player;

    const income = player.getIncome();

    let incomeClass = "top-bar-money-income";
    if (income < 0) { incomeClass += " negative"; }

    return(
      React.DOM.div(
      {
        className: "top-bar",
      },
        React.DOM.div(
        {
          className: "top-bar-info",
        },
          React.DOM.div(
          {
            className: "top-bar-player",
          },
            PlayerFlag(
            {
              props:
              {
                className: "top-bar-player-icon",
              },
              flag: player.flag,
            }),
            React.DOM.div(
            {
              className: "top-bar-turn-number",
            },
              `${localize("turnCounter")()} ${this.props.game.turnNumber}`,
            ),
          ),
          React.DOM.div(
          {
            className: "top-bar-money",
          },
            PlayerMoney(
            {
              player: player,
            }),
            React.DOM.div(
            {
              className: incomeClass,
            },
              `(+${player.getIncome()})`,
            ),
          ),
          TopBarResources(
          {
            player: player,
          }),
        ),
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(TopBarComponent);
export default Factory;
