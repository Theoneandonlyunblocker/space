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

        for (var resourceType in this.props.player.resources)
        {
          var resourceData =
          {
            resource: Rance.app.moduleData.Templates.Resources[resourceType],
            amount: this.props.player.resources[resourceType],
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
