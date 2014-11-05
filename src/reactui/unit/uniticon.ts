/// <reference path="unitstrength.ts"/>

module Rance
{
  export module UIComponents
  {
    export var UnitIcon = React.createClass(
    {
      render: function()
      {
        var unit = this.props.unit;

        var imageProps: any =
        {
          className: "unit-icon",
          src: this.props.icon
        }

        return(
          React.DOM.div({className: "unit-icon-container"},
            React.DOM.img(imageProps)
          )
        );
      }
    });
  }
}