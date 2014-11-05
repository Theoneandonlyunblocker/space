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

        var containerProps =
        {
          className: "unit-container"
        };

        var infoProps =
        {
          key: "info",
          name: unit.name,
          strengthProps:
          {
            maxStrength: unit.maxStrength,
            currentStrength: unit.currentStrength,
            isSquadron: unit.isSquadron
          },
          actionProps:
          {
            maxActionPoints: unit.maxActionPoints,
            currentActionPoints: unit.currentActionPoints
          }
        }

        var elements =
        [
          React.DOM.div({className: "unit-image", key: "image"}),
          UIComponents.UnitInfo(infoProps),
          UIComponents.UnitIcon({icon: unit.template.icon, key: "icon"})
        ];

        if (this.props.facesLeft)
        {
          containerProps.className += " faces-left";
          elements = elements.reverse();
        }
        else
        {
          containerProps.className += " faces-right";
        }

        return(
          React.DOM.div(containerProps,
            elements
          )
        );
      }
    });
  }
}