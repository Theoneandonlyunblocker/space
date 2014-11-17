/// <reference path="fleetinfo.ts"/>

module Rance
{
  export module UIComponents
  {
    export var FleetSelection = React.createClass({

      mergeFleets: function()
      {
        eventManager.dispatchEvent("mergeFleets", null);
      },

      render: function()
      {
        if (!this.props.selectedFleets || this.props.selectedFleets.length <= 0)
        {
          return null;
        }

        var allFleetsInSameLocation = true;
        var hasMultipleSelected = this.props.selectedFleets.length >= 2;

        for (var i = 1; i < this.props.selectedFleets.length; i++)
        {
          if (this.props.selectedFleets[i].location !== this.props.selectedFleets[i-1].location)
          {
            allFleetsInSameLocation = false;
            break;
          }
        }
        var fleetInfos = [];

        for (var i = 0; i < this.props.selectedFleets.length; i++)
        {
          var infoProps: any =
          {
            key: i,
            fleet: this.props.selectedFleets[i],
            hasMultipleSelected: hasMultipleSelected
          };

          fleetInfos.push(UIComponents.FleetInfo(infoProps));
        }

        var fleetSelectionControls = null;

        if (hasMultipleSelected)
        {
          var mergeProps: any =
          {
            className: "fleet-selection-controls-merge"
          }
          if (allFleetsInSameLocation)
          {
            mergeProps.onClick = this.mergeFleets;
          }
          else
          {
            mergeProps.disabled = true;
            mergeProps.className += " disabled";
          }

          fleetSelectionControls = React.DOM.div(
          {
            className: "fleet-selection-controls"
          },
            React.DOM.button(mergeProps,
              "merge"
            )
          )
        }

        return(
          React.DOM.div(
          {
            className: "fleet-selection"
          },
            fleetSelectionControls,
            fleetInfos
          )
        );
      }

    });
  }
}
