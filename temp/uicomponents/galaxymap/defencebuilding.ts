/// <reference path="../playerflag.ts" />

export var DefenceBuilding = React.createFactory(React.createClass(
{
  displayName: "DefenceBuilding",
  shouldComponentUpdate: function(newProps: any)
  {
    return newProps.building !== this.props.building;
  },
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
          key: "flag",
          flag: building.controller.flag
        })
      )
    );
  }

}));
