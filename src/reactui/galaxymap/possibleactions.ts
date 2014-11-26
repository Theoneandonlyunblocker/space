/// <reference path="attacktarget.ts"/>
/// <reference path="../popups/buildablebuildinglist.ts"/>

module Rance
{
  export module UIComponents
  {
    export var PossibleActions = React.createClass({

      getInitialState: function()
      {
        return(
        {
          expandedAction: null
        });
      },

      componentWillReceiveProps: function(newProps: any)
      {
        if (this.props.selectedStar !== newProps.selectedStar &&
          this.state.expandedAction === "buildBuildings")
        {
          this.setState(
          {
            expandedAction: null
          });
        }
      },

      buildBuildings: function()
      {
        var star = this.props.selectedStar;

        this.setState(
        {
          expandedAction: "buildBuildings"
        });
      },

      makeExpandedAction: function()
      {
        switch (this.state.expandedAction)
        {
          case "buildBuildings":
          {
            if (!this.props.selectedStar) return null;

            return(
              UIComponents.BuildableBuildingList(
              {
                star: this.props.selectedStar
              })
            );
          }
          default:
          {
            return null;
          }
        }
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
        if (star && star.getBuildableBuildings().length > 0)
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
            React.DOM.div(
            {
              className: "possible-actions"
            },
              allActions
            ),
            React.DOM.div(
            {
              className: "expanded-action"
            },
              this.makeExpandedAction()
            )
          )
        );
      }
    })
  }
}
