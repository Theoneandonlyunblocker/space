/// <reference path="../../../lib/react-global.d.ts" />


import FleetAttackTarget from "../../FleetAttackTarget";
import Player from "../../Player";
import Star from "../../Star";
import eventManager from "../../eventManager";
import AttackTarget from "./AttackTarget";
import BuildableBuildingList from "./BuildableBuildingList";
import BuildingUpgradeList from "./BuildingUpgradeList";

export interface PropTypes extends React.Props<any>
{
  player: Player;
  setExpandedActionElementOnParent: (element: React.ReactElement<any>) => void;
  selectedStar?: Star;
  attackTargets?: FleetAttackTarget[];
}

interface StateType
{
  canUpgradeBuildings?: boolean;
  expandedAction?: "buildBuildings" | "upgradeBuildings";
  expandedActionElement?: React.ReactHTMLElement<any>;
}

export class PossibleActionsComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "PossibleActions";


  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.state = this.getInitialStateTODO();

    this.bindMethods();
  }
  private bindMethods()
  {
    this.buildBuildings = this.buildBuildings.bind(this);
    this.canUpgradeBuildings = this.canUpgradeBuildings.bind(this);
    this.clearExpandedAction = this.clearExpandedAction.bind(this);
    this.handlePlayerBuiltBuilding = this.handlePlayerBuiltBuilding.bind(this);
    this.updateActions = this.updateActions.bind(this);
    this.upgradeBuildings = this.upgradeBuildings.bind(this);
  }

  private getInitialStateTODO(): StateType
  {
    return(
    {
      expandedAction: null,
      expandedActionElement: null,
      canUpgradeBuildings: this.canUpgradeBuildings(this.props.selectedStar),
    });
  }

  componentWillReceiveProps(newProps: PropTypes)
  {
    if (this.props.selectedStar !== newProps.selectedStar)
    {
      var newState: StateType = {};
      var afterStateSetCallback: () => void;

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
      canUpgradeBuildings: this.canUpgradeBuildings(this.props.selectedStar),
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
      expandedActionElement: null,
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
        className: "expanded-action",
      },
        BuildableBuildingList(
        {
          player: this.props.player,
          star: this.props.selectedStar,
          clearExpandedAction: this.clearExpandedAction,
        }),
      );

      this.setState(
      {
        expandedAction: "buildBuildings",
        expandedActionElement: element,
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
        className: "expanded-action",
      },
        BuildingUpgradeList(
        {
          player: this.props.player,
          star: this.props.selectedStar,
          clearExpandedAction: this.clearExpandedAction,
        }),
      );

      this.setState(
      {
        expandedAction: "upgradeBuildings",
        expandedActionElement: element,
      }, this.updateActions);
    }
  }

  render()
  {
    const allActions: React.ReactElement<any>[] = [];

    if (this.props.attackTargets)
    {
      allActions.push(...this.props.attackTargets.map(attackTarget =>
      {
        return AttackTarget(
        {
          key: attackTarget.enemy.id,
          attackTarget: attackTarget,
        });
      }));
    }

    var star = this.props.selectedStar;
    if (star)
    {
      if (star.owner === this.props.player)
      {
        if (star.getBuildableBuildings().length > 0)
        {
          allActions.push(
            React.DOM.button(
            {
              className: "possible-action",
              onClick: this.buildBuildings,
              key: "buildActions",
            },
              "construct",
            ),
          );
        }

        if (this.state.canUpgradeBuildings)
        {
          allActions.push(
            React.DOM.button(
            {
              className: "possible-action",
              onClick: this.upgradeBuildings,
              key: "upgradeActions",
            },
              "upgrade",
            ),
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
      className: "possible-actions",
    },
      allActions,
    );

    return(
      React.DOM.div(
      {
        className: "possible-actions-wrapper",
      },
        React.DOM.div(
        {
          className: "possible-actions-container" +
            (this.state.expandedAction ? " has-expanded-action" : ""),
        },
          possibleActions,
        ),
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(PossibleActionsComponent);
export default Factory;
