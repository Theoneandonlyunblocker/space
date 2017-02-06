/// <reference path="../../../lib/react-global.d.ts" />

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
  displayName: string = "TopBar";
  updateListener: Function = undefined;

  state: StateType;

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
    var player = this.props.player;

    var income = player.getIncome();

    var incomeClass = "top-bar-money-income";
    if (income < 0) incomeClass += " negative";

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
            }, "Turn " + this.props.game.turnNumber),
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
              "(+" + player.getIncome() + ")",
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
