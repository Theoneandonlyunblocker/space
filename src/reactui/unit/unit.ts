/// <reference path="unitinfo.ts"/>
/// <reference path="uniticon.ts"/>

module Rance
{
  export module UIComponents
  {
    export var Unit = React.createClass(
    {
      render: function()
      {
        var unit = this.props.unit;

        var infoProps =
        {
          name: unit.name,
          strengthProps:
          {
            maxStrength: unit.maxStrength,
            currentStrength: unit.currentStrength,
            isSquadron: unit.isSquadron
          }
        }

        return(
          React.DOM.div({className: "react-unit-container"},
            UIComponents.UnitInfo(infoProps),
            UIComponents.UnitIcon({icon: unit.template.icon})
          )
        );
      }
    });
  }
}