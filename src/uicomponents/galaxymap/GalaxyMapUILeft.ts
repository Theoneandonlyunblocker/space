import * as React from "react";

import
{
  default as FleetSelection,
  FleetSelectionComponent,
} from "./FleetSelection";
import StarInfo from "./StarInfo";
import PossibleActions from "../possibleactions/PossibleActions";
import
{
  ExpandedAction,
  ExpandedActionKind
} from "../possibleactions/ExpandedAction";
import { Fleet } from "../../Fleet";
import Star from "../../Star";
import Player from "../../Player";
import FleetAttackTarget from "../../FleetAttackTarget";
import eventManager from "../../eventManager";


// tslint:disable-next-line:no-any
interface PropTypes extends React.Props<any>
{
  isInspecting: boolean;
  selectedFleets: Fleet[];
  selectedStar: Star;
  currentlyReorganizing: Fleet[];
  closeReorganization: () => void;
  player: Player;

  attackTargets: FleetAttackTarget[];
}

interface StateType
{
  topAndBottomShouldOverlap: boolean;

  expandedAction: ExpandedActionKind;
}

export class GalaxyMapUILeftComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "GalaxyMapUILeft";
  public state: StateType;

  private fleetSelectionComponent: FleetSelectionComponent;

  constructor(props: PropTypes)
  {
    super(props);

    this.state =
    {
      topAndBottomShouldOverlap: false,

      expandedAction: ExpandedActionKind.None,
    };

    this.handleExpandedActionToggle = this.handleExpandedActionToggle.bind(this);
    this.clearExpandedAction = this.clearExpandedAction.bind(this);
    this.handlePlayerBuiltBuilding = this.handlePlayerBuiltBuilding.bind(this);
  }

  public componentDidMount(): void
  {
    eventManager.addEventListener("humanPlayerBuiltBuilding", this.handlePlayerBuiltBuilding);
  }
  public componentWillUnmount(): void
  {
    eventManager.removeEventListener("humanPlayerBuiltBuilding", this.handlePlayerBuiltBuilding);
  }
  public render()
  {
    return(
      React.DOM.div(
      {
        className: "galaxy-map-ui-left" +
          (this.state.topAndBottomShouldOverlap ? " no-docking" : ""),
      },
        React.DOM.div(
        {
          className: "galaxy-map-ui-top-left" +
            (this.state.topAndBottomShouldOverlap ? " no-docking" : ""),
          onClick: () =>
          {
            const isCollapsed = this.topElementIsCollapsed();

            if (isCollapsed)
            {
              console.log("force overlap");
              this.setState({topAndBottomShouldOverlap: true});
            }
          },
        },
          FleetSelection(
          {
            selectedFleets: this.props.selectedFleets,
            isInspecting: this.props.isInspecting,
            selectedStar: this.props.selectedStar,
            currentlyReorganizing: this.props.currentlyReorganizing,
            closeReorganization: this.props.closeReorganization,
            player: this.props.player,

            ref: (component) =>
            {
              this.fleetSelectionComponent = component;
            },
          }),
        ),
        React.DOM.div(
        {
          className: "galaxy-map-ui-bottom-left" +
            (this.state.topAndBottomShouldOverlap ? " no-docking" : ""),
          onClick: () =>
          {

          },
        },
          React.DOM.div(
          {
            className: "galaxy-map-ui-bottom-left-column align-bottom",
            onClick: () =>
            {
              this.setState({topAndBottomShouldOverlap: false});
            }
          },
            PossibleActions(
            {
              player: this.props.player,
              selectedStar: this.props.selectedStar,
              attackTargets: this.props.attackTargets,
              handleExpandActionToggle: this.handleExpandedActionToggle,
            }),
            StarInfo(
            {
              selectedStar: this.props.selectedStar,
            }),
          ),
          ExpandedAction(
          {
            action: this.state.expandedAction,
            player: this.props.player,
            selectedStar: this.props.selectedStar,
            clearExpandedAction: this.clearExpandedAction,
          }),
        ),
      )
    );
  }

  private handleExpandedActionToggle(action: ExpandedActionKind): void
  {
    if (this.state.expandedAction === action)
    {
      this.clearExpandedAction();
    }
    else
    {
      this.setState({expandedAction: action});
    }
  }
  private clearExpandedAction(): void
  {
    this.setState({expandedAction: ExpandedActionKind.None});
  }
  private topElementIsCollapsed(): boolean
  {
    if (!this.fleetSelectionComponent)
    {
      return false;
    }

    const contentsElement = this.fleetSelectionComponent.contentsElement;

    return contentsElement.scrollHeight !== contentsElement.offsetHeight;
  }
  private handlePlayerBuiltBuilding(): void
  {
    this.forceUpdate();
  }
}

// tslint:disable-next-line:variable-name
export const GalaxyMapUILeft: React.Factory<PropTypes> = React.createFactory(GalaxyMapUILeftComponent);
