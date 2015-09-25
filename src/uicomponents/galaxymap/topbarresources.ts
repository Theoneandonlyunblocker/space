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
        var player: Player = this.props.player;
        var resources: ReactComponentPlaceHolder[] = [];
        var resourceIncome = player.getResourceIncome();
        var resourceTypes: string[] = Object.keys(player.resources);

        for (var _resourceType in resourceIncome)
        {
          if (resourceTypes.indexOf(_resourceType) === -1)
          {
            resourceTypes.push(_resourceType);
          }
        }

        for (var i = 0; i < resourceTypes.length; i++)
        {
          var resourceType = resourceTypes[i];
          var amount = player.resources[resourceType] || 0;
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
