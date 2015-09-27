/// <reference path="../playerflag.ts" />

module Rance
{
  export module UIComponents
  {
    export var DefenceBuilding = React.createClass(
    {
      displayName: "DefenceBuilding",
      render: function()
      {
        var building: Building = this.props.building;
        var image = app.images[building.template.iconSrc];

        return(
          React.DOM.div(
          {
            className: "defence-building"
          },
            React.DOM.img(
            {
              className: "defence-building-icon",
              src: colorImageInPlayerColor(image, building.controller),
              title: building.template.displayName
            }),
            UIComponents.PlayerFlag(
            {
              props:
              {
                className: "defence-building-controller",
                title: building.controller.name
              },
              flag: building.controller.flag
            })
          )
        );
      }

    });
  }
}
