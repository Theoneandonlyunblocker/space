/// <reference path="resource.ts" />

module Rance
{
  export module UIComponents
  {
    export var TopBarResources = React.createClass(
    {
      displayName: "TopBarResources",
      render: function()
      {
        var resources: ReactComponentPlaceHolder[] = [];
        var resourceIncome = this.props.player.getResourceIncome();
        var resourceTypes = Object.keys(resourceIncome).concat(Object.keys(this.props.player.resources))

        for (var i = 0; i < resourceTypes.length; i++)
        {
          var resourceType = resourceTypes[i];
          var amount = this.props.player.resources[resourceType] || 0;
          var income = resourceIncome[resourceType].amount || 0;
          if (amount === 0 && income === 0) continue;

          var resourceData =
          {
            resource: app.moduleData.Templates.Resources[resourceType],
            amount: amount,
            income: income,
            key: resourceType
          }
          resources.push(UIComponents.Resource(resourceData));
        }

        return(
          React.DOM.div(
          {
            className: "top-bar-resources"
          },
            resources
          )
        );
      }
    })
  }
}
