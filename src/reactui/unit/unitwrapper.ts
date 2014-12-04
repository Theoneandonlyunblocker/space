/// <reference path="uniticon.ts"/>

module Rance
{
  export module UIComponents
  {
    export var UnitWrapper = React.createClass(
    {
      displayName: "UnitWrapper",
      handleMouseUp: function()
      {
        this.props.onMouseUp(this.props.position);
      },

      render: function()
      {
        var allElements = [];

        var wrapperProps: any =
        {
          className: "unit-wrapper"
        };

        if (this.props.onMouseUp)
        {
          wrapperProps.onMouseUp = this.handleMouseUp
        };

        var empty = UIComponents.EmptyUnit(
        {
          facesLeft: this.props.facesLeft,
          key: "empty_" + this.props.key,
          position: this.props.position
        });

        allElements.push(empty);

        if (this.props.unit)
        {
          var unit = UIComponents.Unit(this.props);
          allElements.push(unit);
        }
        
        return(
          React.DOM.div(wrapperProps,
            allElements
          )
        );
      }
    });
  }
}