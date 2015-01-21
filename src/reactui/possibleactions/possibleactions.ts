/// <reference path="attacktarget.ts"/>
/// <reference path="buildablebuildinglist.ts"/>
/// <reference path="buildableshipslist.ts"/>
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
          });
        }
      },

      componentDidMount: function()
      {
        var self = this;
        eventManager.addEventListener("clearPossibleActions", function()
        {
          self.setState(
          {
            expandedAction: null,
            expandedActionElement: null
          });
        });
      },

      componentWillUnmount: function()
      {
        eventManager.removeAllListeners("clearPossibleActions");
      },

      buildBuildings: function()
      {
        if (!this.props.selectedStar ||
          this.state.expandedAction === "buildBuildings")
        {
          this.setState(
          {
            expandedAction: null,
            expandedActionElement: null
          });
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
              star: this.props.selectedStar
            })
          );

          this.setState(
          {
            expandedAction: "buildBuildings",
            expandedActionElement: element
          });
        }
      },

      buildShips: function()
      {
        if (!this.props.selectedStar ||
          this.state.expandedAction === "buildShips")
        {
          this.setState(
          {
            expandedAction: null,
            expandedActionElement: null
          });
        }
        else
        {
          var element = React.DOM.div(
          {
            className: "expanded-action"
          },
            UIComponents.BuildableShipsList(
            {
              player: this.props.player,
              star: this.props.selectedStar
            })
          );

          this.setState(
          {
            expandedAction: "buildShips",
            expandedActionElement: element
          });
        }
      },

      upgradeBuildings: function()
      {
        if (!this.props.selectedStar ||
          this.state.expandedAction === "upgradeBuildings")
        {
          this.setState(
          {
            expandedAction: null,
            expandedActionElement: null
          });
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
              star: this.props.selectedStar
            })
          );
          
          this.setState(
          {
            expandedAction: "upgradeBuildings",
            expandedActionElement: element
          });
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
        if (star)
        {
          if (star.owner === this.props.player)
          {
            allActions.push(
              React.DOM.div(
              {
                className: "possible-action",
                onClick: this.buildShips,
                key: "buildShipActions"
              },
                "build ship"
              )
            );

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

        var possibleActions = React.DOM.div(
        {
          className: "possible-actions"
        },
          allActions
        );
        
        return(
          React.DOM.div(
          {
            className: "possible-actions-container"
          },
            allActions.length > 0 ?
              possibleActions :
              null,
            this.state.expandedActionElement
          )
        );
      }
    })
  }
}
