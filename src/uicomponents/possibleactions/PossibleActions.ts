import * as React from "react";

import {localize} from "../../../localization/localize";
import FleetAttackTarget from "../../FleetAttackTarget";
import Player from "../../Player";
import Star from "../../Star";

import AttackTarget from "./AttackTarget";
import {ExpandedActionKind} from "./ExpandedAction";


export interface PropTypes extends React.Props<any>
{
  player: Player;
  selectedStar: Star | undefined;
  attackTargets: FleetAttackTarget[];
  handleExpandActionToggle: (action: ExpandedActionKind) => void;
}

interface StateType
{
}

export class PossibleActionsComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "PossibleActions";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }
  public render()
  {
    const star = this.props.selectedStar;
    const hasPlayerStarSelected = star && star.owner === this.props.player;

    const canUpgradeBuildings = hasPlayerStarSelected && Object.keys(star.getBuildingUpgrades()).length > 0;
    const canBuildBuildings = hasPlayerStarSelected && star.getBuildableBuildings().length > 0;

    const hasAnyPossibleAction =
    [
      canUpgradeBuildings,
      canBuildBuildings,
      this.props.attackTargets.length > 0,
    ].some(check => check === true);

    if (!hasAnyPossibleAction)
    {
      return null;
    }

    return(
      React.DOM.div(
      {
        className: "possible-actions-container",
      },
        this.props.attackTargets.map(attackTarget =>
        {
          return AttackTarget(
            {
              key: attackTarget.enemy.id,
              attackTarget: attackTarget,
            });
        }),
        !canBuildBuildings ? null :
          React.DOM.button(
          {
            className: "possible-action",
            onClick: () =>
            {
              this.props.handleExpandActionToggle(ExpandedActionKind.BuildBuildings);
            },
            key: "buildActions",
          },
            localize("constructBuilding")(),
          ),
        !canUpgradeBuildings ? null :
          React.DOM.button(
          {
            className: "possible-action",
            onClick: () =>
            {
              this.props.handleExpandActionToggle(ExpandedActionKind.UpgradeBuildings);
            },
            key: "upgradeActions",
          },
            localize("upgradeBuilding")(),
          )
      )
    );
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(PossibleActionsComponent);
export default factory;
