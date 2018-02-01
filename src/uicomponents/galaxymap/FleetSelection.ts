import * as React from "react";
import * as ReactDOM from "react-dom";

import {Fleet} from "../../Fleet";
import Player from "../../Player";
import Star from "../../Star";
import eventManager from "../../eventManager";
import FleetContents from "./FleetContents";
import FleetInfo from "./FleetInfo";
import FleetReorganization from "./FleetReorganization";

import {localize} from "../../../localization/localize";


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

  ref_TODO_main: HTMLElement;
  ref_TODO_selected: HTMLElement;

  constructor(props: PropTypes)
  {
    super(props);

    this.bindMethods();
  }
  private bindMethods()
  {
    this.reorganizeFleets = this.reorganizeFleets.bind(this);
    this.mergeFleets = this.mergeFleets.bind(this);
    this.setElementPosition = this.setElementPosition.bind(this);
  }

  mergeFleets()
  {
    eventManager.dispatchEvent("mergeFleets", null);
  }
  reorganizeFleets()
  {
    eventManager.dispatchEvent("startReorganizingFleets", this.props.selectedFleets);
  }

  setElementPosition()
  {
    if (!this.ref_TODO_selected) return;
    const domNode = <HTMLElement> ReactDOM.findDOMNode(this.ref_TODO_selected);

    if (!this.props.selectedStar)
    {
      domNode.style.left = "0";
    }
    else
    {
      const containerNode = <HTMLElement> document.getElementsByClassName("galaxy-map-ui-bottom-left")[0];
      const actionsNode = <HTMLElement> containerNode.firstChild.firstChild;
      const actionsRect = actionsNode.getBoundingClientRect();
      const rightMostNode = <HTMLElement> (containerNode.childElementCount > 1 ?
        containerNode.lastChild.lastChild :
        containerNode.lastChild);
      const rightMostRect = rightMostNode.getBoundingClientRect();
      const ownBottom = domNode.getBoundingClientRect().bottom;

      const first = <HTMLElement> ReactDOM.findDOMNode(this.ref_TODO_main).firstChild;

      if (ownBottom > actionsRect.top)
      {
        const styleString = "" + (rightMostRect.right) + "px";
        domNode.style.left = styleString;
        first.style.left = styleString;
        first.classList.add("fleet-selection-displaced");
      }
      else
      {
        domNode.style.left = "0";
        first.style.left = "0";
        first.classList.remove("fleet-selection-displaced");
      }
    }
  }

  componentDidMount()
  {
    this.setElementPosition();

    eventManager.addEventListener("possibleActionsUpdated", this.setElementPosition);
    window.addEventListener("resize", this.setElementPosition, false);
  }

  componentDidUpdate()
  {
    this.setElementPosition();
  }

  componentWillUnmount()
  {
    eventManager.removeEventListener("possibleActionsUpdated", this.setElementPosition);
    window.removeEventListener("resize", this.setElementPosition);
  }

  render()
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

      fleetSelectionControls = React.DOM.div(
      {
        className: "fleet-selection-controls",
      },
        React.DOM.button(reorganizeProps,
          localize("reorganize")(),
        ),
        React.DOM.button(mergeProps,
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
    let reorganizeElement: React.ReactElement<any> = null;
    if (isReorganizing)
    {
      reorganizeElement = FleetReorganization(
      {
        fleets: this.props.currentlyReorganizing,
        closeReorganization: this.props.closeReorganization,
      });
    }

    return(
      React.DOM.div(
      {
        className: "fleet-selection",
        ref: (component: HTMLElement) =>
        {
          this.ref_TODO_main = component;
        },
      },
        fleetSelectionControls,
        hasMultipleSelected ? null : fleetInfos,
        React.DOM.div(
        {
          className: "fleet-selection-selected-wrapper",
        },
          React.DOM.div(
          {
            className: "fleet-selection-selected" + (isReorganizing ? " reorganizing" : ""),
            ref: (component: HTMLElement) =>
            {
              this.ref_TODO_selected = component;
            },
          },
            hasMultipleSelected ? fleetInfos : null,
            fleetContents,
          ),
          reorganizeElement,
        ),
      )
    );
  }

}

const Factory: React.Factory<PropTypes> = React.createFactory(FleetSelectionComponent);
export default Factory;
