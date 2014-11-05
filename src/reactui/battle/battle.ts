/// <reference path="fleet.ts"/>
/// <reference path="turncounter.ts"/>


module Rance
{
  export module UIComponents
  {
    export var Battle = React.createClass(
    {
      render: function()
      {
        var battle = this.props.battle;

        return(
          React.DOM.div({className: "battle-container"},
            UIComponents.Fleet(
            {
              fleet: battle.side1
            }),
            UIComponents.TurnCounter(
            {
              turnsLeft: battle.turnsLeft,
              maxTurns: battle.maxTurns
            }),
            UIComponents.Fleet(
            {
              fleet: battle.side2,
              facesLeft: true
            })
          )
        );
      }
    });
  }
}