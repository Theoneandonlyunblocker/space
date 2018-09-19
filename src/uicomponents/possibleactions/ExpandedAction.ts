import * as React from "react";

import Player from "../../Player";
import Star from "../../Star";

import BuildableBuildingList from "./BuildableBuildingList";
import BuildingUpgradeList from "./BuildingUpgradeList";


export enum ExpandedActionKind
{
  None,
  BuildBuildings,
  UpgradeBuildings,
}

// tslint:disable-next-line:no-any
interface PropTypes extends React.Props<any>
{
  action: ExpandedActionKind;
  player: Player;
  selectedStar: Star;
  clearExpandedAction: () => void;
}

interface StateType
{
}

export class ExpandedActionComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "ExpandedAction";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  public render()
  {
    if (this.props.action === ExpandedActionKind.None)
    {
      return null;
    }

    return(
      React.DOM.div(
      {
        className: "expanded-action"
      },
        this.getExpandedActionElementForAction(this.props.action),
      )
    );
  }

  private getExpandedActionElementForAction(action: ExpandedActionKind): React.ReactElement<any>
  {
    switch (action)
    {
      case ExpandedActionKind.BuildBuildings:
      {
        return BuildableBuildingList(
        {
          player: this.props.player,
          star: this.props.selectedStar,
          clearExpandedAction: this.props.clearExpandedAction,
        });
      }
      case ExpandedActionKind.UpgradeBuildings:
      {
        return BuildingUpgradeList(
        {
          player: this.props.player,
          star: this.props.selectedStar,
          clearExpandedAction: this.props.clearExpandedAction,
        });
      }
      default:
      {
        throw new Error(`Invalid expanded action kind: ${action}`);
      }
    }
  }
}

// tslint:disable-next-line:variable-name
export const ExpandedAction: React.Factory<PropTypes> = React.createFactory(ExpandedActionComponent);
