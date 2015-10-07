/// <reference path="manufacturableunits.ts" />
/// <reference path="manufacturableitems.ts" />

/// <reference path="../../star.ts" />
/// <reference path="../../manufactory.ts" />

module Rance
{
  export module UIComponents
  {
    export var ManufacturableThings = React.createClass(
    {
      displayName: "ManufacturableThings",

      propTypes:
      {
        selectedStar: React.PropTypes.instanceOf(Star),
        player: React.PropTypes.instanceOf(Player).isRequired,
        triggerUpdate: React.PropTypes.func.isRequired
      },

      getInitialState: function()
      {
        return(
        {
          activeTab: "units"
        });
      },

      selectTab: function(key: string)
      {
        if (this.state.activeTab === key) return;
        this.setState(
        {
          activeTab: key
        });
      },
      
      makeTabButton: function(key: string)
      {
        var displayString: string;
        switch (key)
        {
          case "units":
          {
            displayString = "Units";
            break;
          }
          case "items":
          {
            displayString = "Items";
            break;
          }
        }

        return(
          React.DOM.button(
          {
            key: key,
            className: "manufacturable-things-tab-button" +
              (this.state.activeTab === key ? " active-tab" : ""),
            onClick: this.selectTab.bind(this, key)
          },
            displayString
          )
        );
      },

      getManufacturableThings: function(key: string)
      {
        var manufacturableThings: IManufacturableThing[] = [];
        var selectedStar: Star = this.props.selectedStar;
        var player: Player = this.props.player;

        switch (key)
        {
          case "units":
          {
            manufacturableThings = manufacturableThings.concat(player.getGloballyBuildableUnits());
            if (selectedStar)
            {
              if (selectedStar.manufactory)
              {
                manufacturableThings = manufacturableThings.concat(
                  selectedStar.manufactory.getLocalUnitTypes().manufacturable);
              }
            }
            break;
          }
          case "items":
          {
            manufacturableThings = manufacturableThings.concat(player.getGloballyBuildableItems());
            if (selectedStar)
            {
              if (selectedStar.manufactory)
              {
                manufacturableThings = manufacturableThings.concat(
                  selectedStar.manufactory.getLocalItemTypes().manufacturable);
              }
            }
            break;
          }
        }

        return manufacturableThings;
      },

      makeTab: function(key: string)
      {
        var props =
        {
          key: key,
          selectedStar: this.props.selectedStar,
          manufacturableThings: this.getManufacturableThings(key),
          consolidateLocations: false,
          triggerUpdate: this.props.triggerUpdate
        }
        switch (key)
        {
          case "units":
          {
            return(
              UIComponents.ManufacturableUnits(props)
            );
          }
          case "items":
          {
            props.consolidateLocations = true;

            return(
              UIComponents.ManufacturableItems(props)
            );
          }
        }
      },

      render: function()
      {
        return(
          React.DOM.div(
          {
            className: "manufacturable-things"
          },
            React.DOM.div(
            {
              className: "manufacturable-things-tab-buttons"
            },
              this.makeTabButton("units"),
              this.makeTabButton("items")
            ),
            React.DOM.div(
            {
              className: "manufacturable-things-active-tab"
            },
              this.makeTab(this.state.activeTab)
            )
          )
        );
      }
    })
  }
}
