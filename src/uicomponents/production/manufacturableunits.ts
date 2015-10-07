/// <reference path="manufacturablethingslist.ts" />

module Rance
{
  export module UIComponents
  {
    export var ManufacturableUnits = React.createClass(
    {
      displayName: "ManufacturableUnits",

      propTypes:
      {
        selectedStar: React.PropTypes.instanceOf(Star),
        consolidateLocations: React.PropTypes.bool.isRequired,
        manufacturableThings: React.PropTypes.array.isRequired,
        triggerUpdate: React.PropTypes.func.isRequired,
        canBuild: React.PropTypes.bool.isRequired,
        money: React.PropTypes.number.isRequired
      },

      shouldComponentUpdate: function(newProps: any)
      {
        if (this.props.selectedStar !== newProps.selectedStar)
        {
          return true;
        }
        if (this.props.manufacturableThings.length !== newProps.manufacturableThings.length)
        {
          return true;
        }
        else
        {
          
        }
        if (this.props.canBuild !== newProps.canBuild)
        {
          return true;
        }
        if (this.props.money !== newProps.money)
        {
          return true;
        }

        return false;
      },

      addUnitToBuildQueue: function(template: Templates.IUnitTemplate)
      {
        var manufactory: Manufactory = this.props.selectedStar.manufactory;
        manufactory.addThingToQueue(template, "unit");
        this.props.triggerUpdate();
      },

      upgradeHealth: function()
      {
        var manufactory: Manufactory = this.props.selectedStar.manufactory;
        manufactory.upgradeUnitHealthModifier(0.1);
        this.forceUpdate();
      },

      upgradeStats: function()
      {
        var manufactory: Manufactory = this.props.selectedStar.manufactory;
        manufactory.upgradeUnitStatsModifier(0.1);
        this.forceUpdate();
      },

      render: function()
      {
        return(
          React.DOM.div(
          {
            className: "manufacturable-units"
          },
            (!this.props.selectedStar || !this.props.selectedStar.manufactory) ? null : React.DOM.div(
            {
              className: "manufactory-upgrade-buttons-container"
            },
              React.DOM.button(
              {
                className: "manufactory-upgrade-button manufactory-units-upgrade-health-button",
                onClick: this.upgradeHealth
              },
                "Upgrade health" + "\n" + this.props.selectedStar.manufactory.unitHealthModifier.toFixed(1)
              ),
              React.DOM.button(
              {
                className: "manufactory-upgrade-button manufactory-units-upgrade-stats-button",
                onClick: this.upgradeStats
              },
                "Upgrade stats" + "\n" + this.props.selectedStar.manufactory.unitStatsModifier.toFixed(1)
              )
            ),
            UIComponents.ManufacturableThingsList(
            {
              manufacturableThings: this.props.manufacturableThings,
              onClick: (this.props.canBuild ? this.addUnitToBuildQueue : null),
              showCost: true,
              money: this.props.money
            })
          )
        );
      }
    })
  }
}
