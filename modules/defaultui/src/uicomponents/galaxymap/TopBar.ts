import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../../localization/localize";
import {Game} from "core/src/game/Game";
import {Player} from "core/src/player/Player";
import {PlayerFlag} from "../PlayerFlag";

import { PlayerResourcesWithIncome } from "../resources/PlayerResourcesWithIncome";


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

  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }
  render()
  {
    const player = this.props.player;

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
          PlayerResourcesWithIncome(
          {
            player: player,
          }),
        ),
      )
    );
  }
}

export const TopBar: React.Factory<PropTypes> = React.createFactory(TopBarComponent);
