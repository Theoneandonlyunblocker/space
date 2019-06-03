import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import FleetAttackTarget from "../../../../src/FleetAttackTarget";
import eventManager from "../../../../src/eventManager";
import PlayerFlag from "../PlayerFlag";

import {localize} from "../../../localization/localize";


export interface PropTypes extends React.Props<any>
{
  attackTarget: FleetAttackTarget;
}

interface StateType
{
}

export class AttackTargetComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "AttackTarget";
  public state: StateType;

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
    const target = this.props.attackTarget;

    return(
      ReactDOMElements.button(
      {
        className: "attack-target-button possible-action",
        onClick: this.handleAttack,
        title: localize("attackTargetTooltip")(
        {
          enemyName: target.enemy.name.getPossessive(),
          targetType: target.type,
        }),
      },
        ReactDOMElements.span(
        {
          className: "possible-action-title",
        },
          localize("attackTarget_action")(),
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

const factory: React.Factory<PropTypes> = React.createFactory(AttackTargetComponent);
export default factory;
