import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../../localization/localize";
import {Game} from "core/src/game/Game";
import {Player} from "core/src/player/Player";
import {eventManager} from "core/src/app/eventManager";
import {PlayerFlag} from "../PlayerFlag";

import {PlayerMoney} from "./PlayerMoney";
import {TopBarResources} from "./TopBarResources";


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
  private updateListener: () => void;

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

    const incomeSign = income < 0 ? "" : "+";

    return(
      ReactDOMElements.div(
      {
        className: "top-bar",
      },
        ReactDOMElements.div(
        {
          className: "top-bar-info",
        },
          ReactDOMElements.div(
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
            ReactDOMElements.div(
            {
              className: "top-bar-turn-number",
            },
              `${localize("turnCounter")} ${this.props.game.turnNumber}`,
            ),
          ),
          ReactDOMElements.div(
          {
            className: "top-bar-money",
          },
            PlayerMoney(
            {
              player: player,
            }),
            ReactDOMElements.div(
            {
              className: incomeClass,
            },
              `(${incomeSign}${player.getIncome()})`,
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

export const TopBar: React.Factory<PropTypes> = React.createFactory(TopBarComponent);
