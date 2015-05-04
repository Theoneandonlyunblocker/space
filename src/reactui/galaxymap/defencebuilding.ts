module Rance
{
  export module UIComponents
  {
    export var DefenceBuilding = React.createClass(
    {
      displayName: "DefenceBuilding",
      render: function()
      {
        var building = this.props.building;
        var image = app.images["buildings"][building.template.iconSrc];

        return(
          React.DOM.div(
          {
            className: "defence-building"
          },
            React.DOM.img(
            {
              className: "defence-building-icon",
              src: colorImageInPlayerColor(image, building.controller),
              title: building.template.name
            }),
            React.DOM.img(
            {
              className: "defence-building-controller",
              src: building.controller.icon,
              title: building.controller.name
            })
          )
        );
      }

    });
  }
}
