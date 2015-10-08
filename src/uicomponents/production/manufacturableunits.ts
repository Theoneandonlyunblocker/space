/// <reference path="manufacturablethingslist.ts" />
/// <reference path="manufactoryupgradebutton.ts" />

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
        this.props.triggerUpdate();
      },

      upgradeStats: function()
      {
        var manufactory: Manufactory = this.props.selectedStar.manufactory;
        manufactory.upgradeUnitStatsModifier(0.1);
        this.props.triggerUpdate();
      },

      render: function()
      {
        if (this.props.selectedStar && this.props.selectedStar.manufactory)
        {
          var manufactory: Manufactory = this.props.selectedStar.manufactory;
          var unitUpgradeCost = manufactory.getUnitUpgradeCost(); 
          var canAffordUnitUpgrade = this.props.money >= unitUpgradeCost;

          var unitUpgradeButtonBaseClassName = "manufactory-upgrade-button";
          var unitUpgradeCostBaseClassName = "manufactory-upgrade-button-cost";

          if (!canAffordUnitUpgrade)
          {
            unitUpgradeButtonBaseClassName += " disabled";
            unitUpgradeCostBaseClassName += " negative";
          }
        }

        return(
          React.DOM.div(
          {
            className: "manufacturable-units"
          },
            (!this.props.selectedStar || !this.props.selectedStar.manufactory) ? null : React.DOM.div(
            {
              className: "manufactory-upgrade-buttons-container"
            },
              UIComponents.ManufactoryUpgradeButton(
              {
                money: this.props.money,
                upgradeCost: unitUpgradeCost,
                actionString: "Upgrade health",
                currentLevel: manufactory.unitHealthModifier,
                maxLevel: 5.0,
                levelDecimalPoints: 1,
                onClick: this.upgradeHealth
              }),
              UIComponents.ManufactoryUpgradeButton(
              {
                money: this.props.money,
                upgradeCost: unitUpgradeCost,
                actionString: "Upgrade stats",
                currentLevel: manufactory.unitStatsModifier,
                maxLevel: 5.0,
                levelDecimalPoints: 1,
                onClick: this.upgradeStats
              })
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
