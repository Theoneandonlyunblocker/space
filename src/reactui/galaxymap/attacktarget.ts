module Rance
{
  export module UIComponents
  {
    export var AttackTarget = React.createClass({

      render: function()
      {
        var target = this.props.attackTarget;

        console.log(target);
        return(
          React.DOM.div(
          {
            className: "attack-target"
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
