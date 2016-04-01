/// <reference path="../../star.ts" />
/// <reference path="attacktarget.ts"/>
/// <reference path="buildablebuildinglist.ts"/>
/// <reference path="buildingupgradelist.ts"/>

namespace Rance
{
  export namespace UIComponents
  {
    export var PossibleActions = React.createFactory(React.createClass(
    {
      displayName: "PossibleActions",

      propTypes:
      {
        player: React.PropTypes.instanceOf(Player).isRequired,
        setExpandedActionElementOnParent: React.PropTypes.func.isRequired,
        selectedStar: React.PropTypes.instanceOf(Star),
        attackTargets: React.PropTypes.arrayOf(React.PropTypes.object)
      },

      getInitialState: function()
      {
        return(
        {
          expandedAction: null,
          expandedActionElement: null,
          canUpgradeBuildings: this.canUpgradeBuildings(this.props.selectedStar)
        });
      },

      componentWillReceiveProps: function(newProps: any)
      {
        if (this.props.selectedStar !== newProps.selectedStar)
        {
          var newState: any = {};
          var afterStateSetCallback: Function = null;

          newState.canUpgradeBuildings = this.canUpgradeBuildings(newProps.selectedStar);
          if (this.state.expandedActionElement)
          {
            newState.expandedAction = null;
            newState.expandedActionElement = null;

            afterStateSetCallback = this.updateActions;
          }

          this.setState(newState, afterStateSetCallback);
        }
      },

      componentDidMount: function()
      {
        var self = this;
        eventManager.addEventListener("clearPossibleActions", this.clearExpandedAction);
        eventManager.addEventListener("humanPlayerBuiltBuilding", this.handlePlayerBuiltBuilding);
      },

      componentWillUnmount: function()
      {
        eventManager.removeAllListeners("clearPossibleActions");
        eventManager.removeEventListener("humanPlayerBuiltBuilding", this.handlePlayerBuiltBuilding);
      },

      canUpgradeBuildings: function(star: Star)
      {
        return star && Object.keys(star.getBuildingUpgrades()).length > 0;
      },

      handlePlayerBuiltBuilding: function()
      {
        this.setState(
        {
          canUpgradeBuildings: this.canUpgradeBuildings(this.props.selectedStar)
        });
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

            if (this.state.canUpgradeBuildings)
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
    }));
  }
}
