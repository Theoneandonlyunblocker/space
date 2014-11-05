/// <reference path="../../lib/react.d.ts" />

/// <reference path="unit/unit.ts"/>

module Rance
{
  export module UIComponents
  {
    export var Stage = React.createClass(
    {
      render: function()
      {
        return(
          React.DOM.div({className: "react-stage"},
            UIComponents.Unit(
            {
              unit: this.props.unit
            })
          )
        );
      }
    });
  }
}