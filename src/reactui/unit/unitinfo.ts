/// <reference path="unitstrength.ts"/>
/// <reference path="unitactions.ts"/>

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
          React.DOM.div({className: "unit-info"},
            React.DOM.div({className: "unit-info-name"},
              this.props.name
            ),
            UIComponents.UnitStrength(this.props.strengthProps),
            UIComponents.UnitActions(this.props.actionProps)
          )
        );
      }
    });
  }
}