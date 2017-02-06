/// <reference path="../../../lib/react-global.d.ts" />

import FleetAttackTarget from "../../FleetAttackTarget";
import eventManager from "../../eventManager";
import PlayerFlag from "../PlayerFlag";


export interface PropTypes extends React.Props<any>
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
      React.DOM.button(
      {
        className: "attack-target-button possible-action",
        onClick: this.handleAttack,
        title: `Attack ${target.enemy.name.getPossessive()} ${target.type}`,
      },
        React.DOM.span(
        {
          className: "possible-action-title",
        },
          "attack",
        ),
        PlayerFlag(
        {
          flag: target.enemy.flag,
          props:
          {
            className: "attack-target-player-flag",
          },
        }),
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(AttackTargetComponent);
export default Factory;
