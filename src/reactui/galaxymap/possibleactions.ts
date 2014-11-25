/// <reference path="attacktarget.ts"/>


module Rance
{
  export module UIComponents
  {
    export var PossibleActions = React.createClass({

      buildBuildings: function()
      {

      },

      render: function()
      {
        var allActions = [];

        var attackTargets = this.props.attackTargets;
        if (attackTargets && attackTargets.length > 0)
        {
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
          allActions.push(
            React.DOM.div(
            {
              className: "possible-action",
              key: "attackActions"
            },
              React.DOM.div({className: "possible-action-title"}, "attack"),
              attackTargetComponents
            )
          );
        }

        var star = this.props.selectedStar;
        if (star)
        {
          allActions.push(
            React.DOM.div(
            {
              className: "possible-action",
              onClick: this.buildBuildings,
              key: "buildActions"
            },
              "build"
            )
          );
        }
        
        
        return(
          React.DOM.div(
          {
            className: "possible-actions-container"
          },
            allActions
          )
        );
      }
    })
  }
}
