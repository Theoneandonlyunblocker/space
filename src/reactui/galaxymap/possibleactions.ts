/// <reference path="attacktarget.ts"/>


module Rance
{
  export module UIComponents
  {
    export var PossibleActions = React.createClass({

      render: function()
      {
        var attackTargets = this.props.attackTargets;
        if (!attackTargets || attackTargets.length < 1) return null;

        var attackTargetComponents = [];
        for (var i = 0; i < attackTargets.length; i++)
        {
          var props: any =
          {
            key: i,
            attackTarget: attackTargets[i]
          };

          attackTargetComponents.push(UIComponents.AttackTarget(
            props
          ));
        }
        
        return(
          React.DOM.div(
          {
            className: "possible-actions"
          },
            attackTargetComponents
          )
        );
      }
    })
  }
}
