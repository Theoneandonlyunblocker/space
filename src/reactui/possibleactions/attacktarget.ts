module Rance
{
  export module UIComponents
  {
    export var AttackTarget = React.createClass(
    {
      displayName: "AttackTarget",
      handleAttack: function()
      {
        eventManager.dispatchEvent("attackTarget", this.props.attackTarget);
      },

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
            React.DOM.img(
            {
              className: "attack-target-player-icon",
              src: target.enemy.icon
            })
          )
        );
      }
    })
  }
}
