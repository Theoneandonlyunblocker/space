/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="playermoney.ts" />
/// <reference path="topbarresources.ts" />
/// <reference path="../playerflag.ts" />


import Player from "../../../src/Player.ts";
import PlayerFlag from "../PlayerFlag.ts";
import PlayerMoney from "./PlayerMoney.ts";
import TopBarResources from "./TopBarResources.ts";
import eventManager from "../../../src/eventManager.ts";


export interface PropTypes extends React.Props<any>
{
  // TODO refactor | add prop types
}

interface StateType
{
  // TODO refactor | add state type
}

class TopBar_COMPONENT_TODO extends React.Component<PropTypes, StateType>
{
  displayName: string = "TopBar";
  updateListener: reactTypeTODO_any = undefined;

  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
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
            PlayerFlag(
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
            PlayerMoney(
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
          TopBarResources(
          {
            player: player  
          })
        )
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(TopBar_COMPONENT_TODO);
export default Factory;
