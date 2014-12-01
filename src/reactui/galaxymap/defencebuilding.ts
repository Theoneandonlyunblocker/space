module Rance
{
  export module UIComponents
  {
    export var DefenceBuilding = React.createClass({

      render: function()
      {
        var building = this.props.building;

        return(
          React.DOM.div(
          {
            className: "defence-building"
          },
            React.DOM.img(
            {
              className: "defence-building-icon",
              src: colorImageInPlayerColor( building.template.icon,
                building.controller)
            }),
            React.DOM.img(
            {
              className: "defence-building-controller",
              src: building.controller.icon
            })
          )
        );
      }

    });
  }
}
