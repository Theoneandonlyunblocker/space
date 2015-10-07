/// <reference path="manufacturablethingslist.ts" />

/// <reference path="../../manufactory.ts" />

module Rance
{
  export module UIComponents
  {
    export var BuildQueue = React.createClass(
    {
      displayName: "BuildQueue",

      propTypes:
      {
        manufactory: React.PropTypes.instanceOf(Manufactory).isRequired,
        triggerUpdate: React.PropTypes.func.isRequired
      },

      removeItem: function(template: IManufacturableThing, parentIndex: number)
      {
        var manufactory: Manufactory = this.props.manufactory;
        manufactory.removeThingAtIndex(parentIndex);
        this.props.triggerUpdate();
      },

      upgradeCapacity: function()
      {
        var manufactory: Manufactory = this.props.manufactory;
        manufactory.upgradeCapacity(1);
        this.props.triggerUpdate();
      },

      render: function()
      {
        var manufactory: Manufactory = this.props.manufactory;

        var convertedBuildQueue: IManufacturableThing[] = [];

        for (var i = 0; i < manufactory.buildQueue.length; i++)
        {
          convertedBuildQueue.push(manufactory.buildQueue[i].template);
        }

        var canUpgradeCapacity = manufactory.capacity < manufactory.maxCapacity;

        return(
          React.DOM.div(
          {
            className: "build-queue"
          },
            React.DOM.button(
            {
              className: "manufactory-upgrade-button manufactory-items-upgrade-button" +
                (canUpgradeCapacity ? "" : " disabled"),
              disabled: !canUpgradeCapacity,
              onClick: (canUpgradeCapacity ? this.upgradeCapacity : null)
            },
              "Upgrade capacity"
            ),
            React.DOM.div(
            {
              className: "build-queue-header"
            },
              "Build queue"
            ),
            UIComponents.ManufacturableThingsList(
            {
              manufacturableThings: convertedBuildQueue,
              onClick: this.removeItem,
              showCost: false
            })
          )
        );
      }
    })
  }
}
