/// <reference path="attacktarget.ts"/>
/// <reference path="buildablebuildinglist.ts"/>
/// <reference path="buildingupgradelist.ts"/>

module Rance
{
  export module UIComponents
  {
    export var PossibleActions = React.createClass(
    {
      displayName: "PossibleActions",
      getInitialState: function()
      {
        return(
        {
          expandedAction: null,
          expandedActionElement: null
        });
      },

      componentWillReceiveProps: function(newProps: any)
      {
        if (this.props.selectedStar !== newProps.selectedStar &&
          this.state.expandedActionElement)
        {
          this.setState(
          {
            expandedAction: null,
            expandedActionElement: null
          }, this.updateActions);
        }
      },

      componentDidMount: function()
      {
        var self = this;
        eventManager.addEventListener("clearPossibleActions", this.clearExpandedAction);
      },

      componentWillUnmount: function()
      {
        eventManager.removeAllListeners("clearPossibleActions");
      },

      updateActions: function()
      {
        this.props.setExpandedActionElementOnParent(this.state.expandedActionElement);
        eventManager.dispatchEvent("possibleActionsUpdated");
      },

      clearExpandedAction: function()
      {
        this.setState(
        {
          expandedAction: null,
          expandedActionElement: null
        }, this.updateActions);
      },

      buildBuildings: function()
      {
        if (!this.props.selectedStar ||
          this.state.expandedAction === "buildBuildings")
        {
          this.clearExpandedAction();
        }
        else
        {
          var element = React.DOM.div(
          {
            className: "expanded-action"
          },
            UIComponents.BuildableBuildingList(
            {
              player: this.props.player,
              star: this.props.selectedStar,
              clearExpandedAction: this.clearExpandedAction
            })
          );

          this.setState(
          {
            expandedAction: "buildBuildings",
            expandedActionElement: element
          }, this.updateActions);
        }
      },

      upgradeBuildings: function()
      {
        if (!this.props.selectedStar ||
          this.state.expandedAction === "upgradeBuildings")
        {
          this.clearExpandedAction();
        }
        else
        {
          var element = React.DOM.div(
          {
            className: "expanded-action"
          },
            UIComponents.BuildingUpgradeList(
            {
              player: this.props.player,
              star: this.props.selectedStar,
              clearExpandedAction: this.clearExpandedAction
            })
          );
          
          this.setState(
          {
            expandedAction: "upgradeBuildings",
            expandedActionElement: element
          }, this.updateActions);
        }
      },

      render: function()
      {
        var allActions: ReactDOMPlaceHolder[] = [];

        var attackTargets = this.props.attackTargets;
        if (attackTargets && attackTargets.length > 0)
        {
          var attackTargetComponents: ReactComponentPlaceHolder[] = [];
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
          if (star.owner === this.props.player)
          {
            if (star.getBuildableBuildings().length > 0)
            {
              allActions.push(
                React.DOM.div(
                {
                  className: "possible-action",
                  onClick: this.buildBuildings,
                  key: "buildActions"
                },
                  "construct"
                )
              );
            }

            if (Object.keys(star.getBuildingUpgrades()).length > 0)
            {
              allActions.push(
                React.DOM.div(
                {
                  className: "possible-action",
                  onClick: this.upgradeBuildings,
                  key: "upgradeActions"
                },
                  "upgrade"
                )
              );
            }
          }
        }

        if (allActions.length < 1)
        {
          return null;
        }

        var possibleActions = React.DOM.div(
        {
          className: "possible-actions"
        },
          allActions
        );
        
        return(
          React.DOM.div(
          {
            className: "possible-actions-wrapper"
          },
            React.DOM.div(
            {
              className: "possible-actions-container" +
                (this.state.expandedAction ? " has-expanded-action" : "")
            },
              possibleActions
            )
          )
        );
      }
    })
  }
}
