/// <reference path="uniticon.ts"/>

module Rance
{
  export module UIComponents
  {
    export var UnitWrapper = React.createClass(
    {
      render: function()
      {
        var allElements = [];

        var empty = UIComponents.EmptyUnit(
        {
          facesLeft: this.props.facesLeft,
          key: "empty_" + this.props.key
        });

        allElements.push(empty);

        if (this.props.unit)
        {
          var unit = UIComponents.Unit(this.props);
          allElements.push(unit);
        }
        
        return(
          React.DOM.div({className: "unit-super-wrapper"},
            allElements
          )
        );
      }
    });
  }
}