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

        for (var resourceType in this.props.player.resources)
        {
          var amount = this.props.player.resources[resourceType];
          var income = resourceIncome[resourceType].amount;
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
