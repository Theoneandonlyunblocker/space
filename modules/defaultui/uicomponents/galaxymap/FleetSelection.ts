import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../localization/localize";
import {Fleet} from "../../../../src/fleets/Fleet";
import {Player} from "../../../../src/player/Player";
import {Star} from "../../../../src/map/Star";
import {eventManager} from "../../../../src/app/eventManager";

import {FleetContents} from "./FleetContents";
import {FleetInfo} from "./FleetInfo";
import {FleetReorganization} from "./FleetReorganization";
import { DefaultWindow } from "../windows/DefaultWindow";


export interface PropTypes extends React.Props<any>
{
  selectedFleets: Fleet[];
  player: Player;
  isInspecting: boolean;
  closeReorganization: () => void;
  currentlyReorganizing: Fleet[];
  selectedStar: Star;
}

interface StateType
{
}

export class FleetSelectionComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "FleetSelection";
  public state: StateType;

  public readonly contentsElement = React.createRef<HTMLDivElement>();

  constructor(props: PropTypes)
  {
    super(props);

    this.bindMethods();

    this.state =
    {
      isCompacted: false,
      compactionIsOverridden: false,
    };
  }
  private bindMethods()
  {
    this.reorganizeFleets = this.reorganizeFleets.bind(this);
    this.mergeFleets = this.mergeFleets.bind(this);
  }
  public render()
  {
    const selectedFleets: Fleet[] = this.props.selectedFleets;
    if (!selectedFleets || selectedFleets.length <= 0)
    {
      return null;
    }

    let allFleetsInSameLocation = true;
    const hasMultipleSelected = selectedFleets.length >= 2;

    for (let i = 1; i < selectedFleets.length; i++)
    {
      if (selectedFleets[i].location !== selectedFleets[i - 1].location)
      {
        allFleetsInSameLocation = false;
        break;
      }
    }
    const fleetInfos: React.ReactElement<any>[] = [];

    for (let i = 0; i < selectedFleets.length; i++)
    {
      const fleet = selectedFleets[i];

      fleetInfos.push(FleetInfo(
      {
        key: fleet.id,
        fleet: fleet,
        hasMultipleSelected: hasMultipleSelected,
        isInspecting: this.props.isInspecting,
        isNotDetected: this.props.isInspecting && !this.props.player.fleetIsFullyIdentified(fleet),
      }));
    }

    let fleetSelectionControls: React.ReactHTMLElement<any> = null;

    if (hasMultipleSelected)
    {
      const fleetStealthsAreClashing =
        selectedFleets.length === 2 && selectedFleets[0].isStealthy !== selectedFleets[1].isStealthy;

      const mergeProps: React.ButtonHTMLAttributes<HTMLButtonElement> =
      {
        className: "fleet-selection-controls-merge",
      };

      if (allFleetsInSameLocation && !this.props.isInspecting && !fleetStealthsAreClashing)
      {
        mergeProps.onClick = this.mergeFleets;
      }
      else
      {
        mergeProps.disabled = true;
        mergeProps.className += " disabled";
      }

      const reorganizeProps: React.ButtonHTMLAttributes<HTMLButtonElement> =
      {
        className: "fleet-selection-controls-reorganize",
      };
      if (allFleetsInSameLocation && selectedFleets.length === 2 && !this.props.isInspecting &&
        !fleetStealthsAreClashing)
      {
        reorganizeProps.onClick = this.reorganizeFleets;
      }
      else
      {
        reorganizeProps.disabled = true;
        reorganizeProps.className += " disabled";
      }

      fleetSelectionControls = ReactDOMElements.div(
      {
        className: "fleet-selection-controls",
      },
        ReactDOMElements.button(reorganizeProps,
          localize("reorganize")(),
        ),
        ReactDOMElements.button(mergeProps,
          localize("merge")(),
        ),
      );
    }

    let fleetContents: React.ReactElement<any> = null;

    if (!hasMultipleSelected)
    {
      fleetContents = FleetContents(
      {
        fleet: selectedFleets[0],
        player: this.props.player,
      });
    }

    const isReorganizing = this.props.currentlyReorganizing.length > 0;

    return(
      ReactDOMElements.div(
      {
        className: "fleet-selection",
      },
        fleetSelectionControls,
        hasMultipleSelected ? null : fleetInfos,
        ReactDOMElements.div(
        {
          className: "fleet-selection-selected",
          ref: this.contentsElement,
        },
          hasMultipleSelected ? fleetInfos : null,
          fleetContents,
        ),
        !isReorganizing ? null :
          DefaultWindow(
          {
            title: localize("reorganizeFleets")(),
            handleClose: this.props.closeReorganization,
            isResizable: false,
          },
            FleetReorganization(
            {
              fleets: this.props.currentlyReorganizing,
              closeReorganization: this.props.closeReorganization,
            }),
          ),
        )
    );
  }

  private mergeFleets(): void
  {
    eventManager.dispatchEvent("endReorganizingFleets");
    eventManager.dispatchEvent("mergeFleets", null);
  }
  private reorganizeFleets(): void
  {
    eventManager.dispatchEvent("startReorganizingFleets", this.props.selectedFleets);
  }
}

export const FleetSelection: React.Factory<PropTypes> = React.createFactory(FleetSelectionComponent);
