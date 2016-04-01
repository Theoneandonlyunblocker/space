/// <reference path="fleetinfo.ts"/>
/// <reference path="fleetcontents.ts"/>
/// <reference path="fleetreorganization.ts"/>

export namespace UIComponents
{
  export var FleetSelection = React.createFactory(React.createClass(
  {
    displayName: "FleetSelection",
    mergeFleets: function()
    {
      eventManager.dispatchEvent("mergeFleets", null);
    },
    reorganizeFleets: function()
    {
      eventManager.dispatchEvent("startReorganizingFleets", this.props.selectedFleets);
    },

    setElementPosition: function()
    {
      if (!this.refs.selected) return;
      var domNode = this.refs.selected.getDOMNode();

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

        var first = this.refs.main.getDOMNode().firstChild

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
    },

    componentDidMount: function()
    {
      this.setElementPosition();

      eventManager.addEventListener("possibleActionsUpdated", this.setElementPosition);
      window.addEventListener("resize", this.setElementPosition, false);
    },

    componentDidUpdate: function()
    {
      this.setElementPosition()
    },

    componentWillUnmount: function()
    {
      eventManager.removeEventListener("possibleActionsUpdated", this.setElementPosition);
      window.removeEventListener("resize", this.setElementPosition)
    },

    render: function()
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
      var fleetInfos: ReactComponentPlaceHolder[] = [];

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

        fleetInfos.push(UIComponents.FleetInfo(infoProps));
      }

      var fleetSelectionControls: ReactDOMPlaceHolder = null;

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

      var fleetContents: ReactComponentPlaceHolder = null;

      if (!hasMultipleSelected)
      {
        fleetContents = UIComponents.FleetContents(
        {
          fleet: selectedFleets[0],
          player: this.props.player
        });
      }

      var isReorganizing = this.props.currentlyReorganizing.length > 0;
      var reorganizeElement: ReactComponentPlaceHolder = null;
      if (isReorganizing)
      {
        reorganizeElement = UIComponents.FleetReorganization(
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

  }));
}
