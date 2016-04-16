/// <reference path="../../../lib/react-global-0.13.3.d.ts" />

import PlayerFlag from "../PlayerFlag";
import DefenceBuildingList from "../galaxymap/DefenceBuildingList";

import BattlePrep from "../../BattlePrep";


interface PropTypes extends React.Props<any>
{
  battlePrep: BattlePrep;
}

interface StateType
{
}

export class BattleInfoComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "BattleInfo";
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }
  
  render()
  {
    var battlePrep = this.props.battlePrep;
    var star = battlePrep.battleData.location;
    var isAttacker = battlePrep.humanPlayer === battlePrep.attacker;

    return(
      React.DOM.div(
      {
        className: "battle-info"
      },
        React.DOM.div(
        {
          className: "battle-info-opponent"
        },
          PlayerFlag(
          {
            flag: battlePrep.enemyPlayer.flag,
            props:
            {
              className: "battle-info-opponent-icon",
            }
          }),
          React.DOM.div(
          {
            className: "battle-info-opponent-name"
          },
            battlePrep.enemyPlayer.name
          )
        ),
        React.DOM.div(
        {
          className: "battle-info-summary"
        },
          star.name + ": " + (isAttacker ? "Attacking" : "Defending")
        ),
        DefenceBuildingList(
        {
          buildings: star.buildings["defence"],
          reverse: isAttacker
        })
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(BattleInfoComponent);
export default Factory;
