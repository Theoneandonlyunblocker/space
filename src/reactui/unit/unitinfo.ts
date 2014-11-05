/// <reference path="unitstrength.ts"/>

module Rance
{
  export module UIComponents
  {
    export var UnitInfo = React.createClass(
    {
      render: function()
      {
        var unit = this.props.unit;

        return(
          React.DOM.div("react-unit-info",
            React.DOM.div({className: "react-unit-info-name"},
              this.props.name
            ),
            UIComponents.UnitStrength(this.props.strengthProps)
          )
        );
      }
    });
  }
}