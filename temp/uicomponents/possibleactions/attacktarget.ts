/// <reference path="../playerflag.ts" />

export interface PropTypes
{
  // TODO refactor | add prop types
}

export default class AttackTarget extends React.Component<PropTypes, {}>
{
  displayName: string = "AttackTarget";
  handleAttack: function()
  {
    eventManager.dispatchEvent("attackTarget", this.props.attackTarget);
  }

  render: function()
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
        UIComponents.PlayerFlag(
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
