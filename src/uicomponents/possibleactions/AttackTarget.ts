/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react/addons";

import FleetAttackTarget from "../../FleetAttackTarget";
import eventManager from "../../eventManager";
import PlayerFlag from "../PlayerFlag";


interface PropTypes extends React.Props<any>
{
  attackTarget: FleetAttackTarget;
}

interface StateType
{
}

export class AttackTargetComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "AttackTarget";
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.handleAttack = this.handleAttack.bind(this);    
  }
  
  handleAttack()
  {
    eventManager.dispatchEvent("attackTarget", this.props.attackTarget);
  }

  render()
  {
    var target = this.props.attackTarget;

    return(
      React.DOM.div(
      {
        className: "attack-target",
        onClick: this.handleAttack
      },
        React.DOM.div(
        {
          className: "attack-target-type"
        }, target.type),
        PlayerFlag(
        {
          flag: target.enemy.flag,
          props:
          {
            className: "attack-target-player-icon"
          }
        })
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(AttackTargetComponent);
export default Factory;
