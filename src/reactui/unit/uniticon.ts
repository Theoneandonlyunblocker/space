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
        };

        var fillerProps: any =
        {
          className: "unit-icon-filler"
        };

        if (this.props.isActiveUnit)
        {
          fillerProps.className += " active-border";
          imageProps.className += " active-border";
        }

        if (this.props.facesLeft)
        {
          fillerProps.className += " unit-border-right";
          imageProps.className += " unit-border-no-right";
        }
        else
        {
          fillerProps.className += " unit-border-left";
          imageProps.className += " unit-border-no-left";
        }

        var middleElement = this.props.icon ?
          React.DOM.img(imageProps) :
          React.DOM.div(imageProps);

        return(
          React.DOM.div({className: "unit-icon-container"},
            React.DOM.div(fillerProps),
            middleElement,
            React.DOM.div(fillerProps)
          )
        );
      }
    });
  }
}