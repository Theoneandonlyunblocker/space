/// <reference path="../../lib/react.d.ts" />

/// <reference path="battle/battle.ts"/>

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
            UIComponents.Battle({battle: this.props.battle})
          )
        );
      }
    });
  }
}