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

      render: function()
      {
        var manufactory: Manufactory = this.props.manufactory;

        var convertedBuildQueue: IManufacturableThing[] = [];

        for (var i = 0; i < manufactory.buildQueue.length; i++)
        {
          convertedBuildQueue.push(manufactory.buildQueue[i].template);
        }

        return(
          React.DOM.div(
          {
            className: "build-queue"
          },
            React.DOM.div(
            {
              className: "build-queue-header"
            },
              "Build queue"
            ),
            UIComponents.ManufacturableThingsList(
            {
              manufacturableThings: convertedBuildQueue,
              onClick: this.removeItem
            })
          )
        );
      }
    })
  }
}
