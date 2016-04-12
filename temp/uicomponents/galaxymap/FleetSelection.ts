/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="fleetinfo.ts"/>
/// <reference path="fleetcontents.ts"/>
/// <reference path="fleetreorganization.ts"/>


import eventManager from "../../../src/eventManager.ts";
import FleetInfo from "./FleetInfo.ts";
import FleetContents from "./FleetContents.ts";
import fleets from "../../../modules/defaultmapmodes/maplayertemplates/fleets.ts";
import FleetReorganization from "./FleetReorganization.ts";
import Fleet from "../../../src/Fleet.ts";


export interface PropTypes extends React.Props<any>
{
  selectedFleets: any; // TODO refactor | define prop type 123
  player: any; // TODO refactor | define prop type 123
  isInspecting: any; // TODO refactor | define prop type 123
  closeReorganization: any; // TODO refactor | define prop type 123
  currentlyReorganizing: any; // TODO refactor | define prop type 123
  selectedStar: any; // TODO refactor | define prop type 123
}

interface StateType
{
}

interface RefTypes extends React.Refs
{
  main: HTMLElement;
  selected: HTMLElement;
}

export class FleetSelection_COMPONENT_TODO extends React.Component<PropTypes, StateType>
{
  displayName: string = "FleetSelection";
  state: StateType;
  refsTODO: RefTypes;

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
    if (!this.refsTODO.selected) return;
    var domNode = React.findDOMNode<HTMLElement>(this.refsTODO.selected);

    if (!this.props.selectedStar)
    {
      domNode.style.left = 0;
    }
    else
    {
      var containerNode = <HTMLElement> document.getElementsByClassName("galaxy-map-ui-bottom-left")[0];
      var actionsNode = <HTMLElement> containerNode.firstChild.firstChild;
      var actionsRect = actionsNode.getBoundingClientRect();
      var rightMostNode = <HTMLElement> (containerNode.childElementCount > 1 ?
        containerNode.lastChild.lastChild :
        containerNode.lastChild);
      var rightMostRect = rightMostNode.getBoundingClientRect();
      var ownBottom = domNode.getBoundingClientRect().bottom;

      var first = React.findDOMNode<HTMLElement>(this.refsTODO.main).firstChild

      if (ownBottom > actionsRect.top)
      {
        var styleString = "" + (rightMostRect.right) + "px";
        domNode.style.left = styleString;
        first.style.left = styleString;
        first.classList.add("fleet-selection-displaced");
      }
      else
      {
        domNode.style.left = 0;
        first.style.left = 0;
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
    this.setElementPosition()
  }

  componentWillUnmount()
  {
    eventManager.removeEventListener("possibleActionsUpdated", this.setElementPosition);
    window.removeEventListener("resize", this.setElementPosition)
  }

  render()
  {
    var selectedFleets: Fleet[] = this.props.selectedFleets;
    if (!selectedFleets || selectedFleets.length <= 0)
    {
      return null;
    }

    var allFleetsInSameLocation = true;
    var hasMultipleSelected = selectedFleets.length >= 2;

    for (var i = 1; i < selectedFleets.length; i++)
    {
      if (selectedFleets[i].location !== selectedFleets[i-1].location)
      {
        allFleetsInSameLocation = false;
        break;
      }
    }
    var fleetInfos: React.ReactElement<any>[] = [];

    for (var i = 0; i < selectedFleets.length; i++)
    {
      var fleet = selectedFleets[i];
      var infoProps: any =
      {
        key: fleet.id,
        fleet: fleet,
        hasMultipleSelected: hasMultipleSelected,
        isInspecting: this.props.isInspecting,
        isNotDetected: this.props.isInspecting && !this.props.player.fleetIsFullyIdentified(fleet)
      };

      fleetInfos.push(FleetInfo(infoProps));
    }

    var fleetSelectionControls: React.HTMLElement = null;

    if (hasMultipleSelected)
    {
      var fleetStealthsAreClashing =
        selectedFleets.length === 2 && selectedFleets[0].isStealthy !== selectedFleets[1].isStealthy;

      var mergeProps: any =
      {
        className: "fleet-selection-controls-merge"
      }
      if (allFleetsInSameLocation && !this.props.isInspecting && !fleetStealthsAreClashing)
      {
        mergeProps.onClick = this.mergeFleets;
      }
      else
      {
        mergeProps.disabled = true;
        mergeProps.className += " disabled";
      }

      var reorganizeProps: any =
      {
        className: "fleet-selection-controls-reorganize"
      }
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
        className: "fleet-selection-controls"
      },
        React.DOM.button(reorganizeProps,
          "reorganize"
        ),
        React.DOM.button(mergeProps,
          "merge"
        )
      )
    }

    var fleetContents: React.ReactElement<any> = null;

    if (!hasMultipleSelected)
    {
      fleetContents = FleetContents(
      {
        fleet: selectedFleets[0],
        player: this.props.player
      });
    }

    var isReorganizing = this.props.currentlyReorganizing.length > 0;
    var reorganizeElement: React.ReactElement<any> = null;
    if (isReorganizing)
    {
      reorganizeElement = FleetReorganization(
      {
        fleets: this.props.currentlyReorganizing,
        closeReorganization: this.props.closeReorganization
      });
    }

    return(
      React.DOM.div(
      {
        className: "fleet-selection",
        ref: "main"
      },
        fleetSelectionControls,
        hasMultipleSelected ? null : fleetInfos,
        React.DOM.div(
        {
          className: "fleet-selection-selected-wrapper"
        },
          React.DOM.div(
          {
            className: "fleet-selection-selected" + (isReorganizing ? " reorganizing" : ""),
            ref: "selected"
          },
            hasMultipleSelected ? fleetInfos : null,
            fleetContents
          ),
          reorganizeElement
        )
      )
    );
  }

}

const Factory: React.Factory<PropTypes> = React.createFactory(FleetSelection_COMPONENT_TODO);
export default Factory;
