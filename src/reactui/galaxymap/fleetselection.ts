/// <reference path="fleetinfo.ts"/>
/// <reference path="fleetcontents.ts"/>
/// 
module Rance
{
  export module UIComponents
  {
    export var FleetSelection = React.createClass({

      mergeFleets: function()
      {
        eventManager.dispatchEvent("mergeFleets", null);
      },
      reorganizeFleets: function()
      {
        eventManager.dispatchEvent("startReorganizingFleets", this.props.selectedFleets);
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
        var fleetInfos = [];

        for (var i = 0; i < selectedFleets.length; i++)
        {
          var infoProps: any =
          {
            key: selectedFleets[i].id,
            fleet: selectedFleets[i],
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

          var reorganizeProps: any =
          {
            className: "fleet-selection-controls-reorganize"
          }
          if (allFleetsInSameLocation && selectedFleets.length === 2)
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

        var fleetContents = null;

        if (!hasMultipleSelected)
        {
          fleetContents = UIComponents.FleetContents(
          {
            fleet: selectedFleets[0]
          });
        }

        return(
          React.DOM.div(
          {
            className: "fleet-selection"
          },
            fleetSelectionControls,
            hasMultipleSelected ? null : fleetInfos,
            React.DOM.div(
            {
              className: "fleet-selection-selected-wrapper"
            },
              React.DOM.div(
              {
                className: "fleet-selection-selected"
              },
                hasMultipleSelected ? fleetInfos : null,
                fleetContents
              )
            )
          )
        );
      }

    });
  }
}
