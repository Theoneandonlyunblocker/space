/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../../star.ts" />
/// <reference path="attacktarget.ts"/>
/// <reference path="buildablebuildinglist.ts"/>
/// <reference path="buildingupgradelist.ts"/>

export interface PropTypes
{
  player: Player;
  setExpandedActionElementOnParent: reactTypeTODO_func;
  selectedStar?: Star;
  attackTargets?: reactTypeTODO_object[];
}

export default class PossibleActions extends React.Component<PropTypes, {}>
{
  displayName: string = "PossibleActions";


  state:
  {
    
  }

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  getInitialState()
  {
    return(
    {
      expandedAction: null,
      expandedActionElement: null,
      canUpgradeBuildings: this.canUpgradeBuildings(this.props.selectedStar)
    });
  }

  componentWillReceiveProps(newProps: any)
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
  }

  componentDidMount()
  {
    var self = this;
    eventManager.addEventListener("clearPossibleActions", this.clearExpandedAction);
    eventManager.addEventListener("humanPlayerBuiltBuilding", this.handlePlayerBuiltBuilding);
  }

  componentWillUnmount()
  {
    eventManager.removeAllListeners("clearPossibleActions");
    eventManager.removeEventListener("humanPlayerBuiltBuilding", this.handlePlayerBuiltBuilding);
  }

  canUpgradeBuildings(star: Star)
  {
    return star && Object.keys(star.getBuildingUpgrades()).length > 0;
  }

  handlePlayerBuiltBuilding()
  {
    this.setState(
    {
      canUpgradeBuildings: this.canUpgradeBuildings(this.props.selectedStar)
    });
  }

  updateActions()
  {
    this.props.setExpandedActionElementOnParent(this.state.expandedActionElement);
    eventManager.dispatchEvent("possibleActionsUpdated");
  }

  clearExpandedAction()
  {
    this.setState(
    {
      expandedAction: null,
      expandedActionElement: null
    }, this.updateActions);
  }

  buildBuildings()
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
  }

  upgradeBuildings()
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
  }

  render()
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
}
