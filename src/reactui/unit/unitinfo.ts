/// <reference path="unitstrength.ts"/>
/// <reference path="unitactions.ts"/>
/// <reference path="unitstatus.ts"/>

module Rance
{
  export module UIComponents
  {
    export var UnitInfo = React.createClass(
    {
      displayName: "UnitInfo",
      render: function()
      {
        var unit = this.props.unit;

        return(
          React.DOM.div({className: "unit-info"},
            React.DOM.div({className: "unit-info-name"},
              unit.name
            ),
            UIComponents.UnitStatus(
            {
              guard: unit.battleStats.guard
            }),
            UIComponents.UnitStrength(
            {
              maxStrength: unit.maxStrength,
              currentStrength: unit.currentStrength,
              isSquadron: unit.isSquadron
            }),
            UIComponents.UnitActions(
            {
              maxActionPoints: unit.maxActionPoints,
              currentActionPoints: unit.battleStats.currentActionPoints
            })
          )
        );
      }
    });
  }
}
