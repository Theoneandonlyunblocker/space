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
          className: "unit-container",
          key: "container"
        };
        var wrapperProps =
        {
          className: "unit-wrapper"
        };

        if (this.props.facesLeft)
        {
          containerProps.className += " enemy-unit";
          wrapperProps.className += " enemy-unit-bg";
        }
        else
        {
          containerProps.className += " friendly-unit";
          wrapperProps.className += " friendly-unit-bg";
        }

        if (unit.id === this.props.activeUnit.id)
        {
          containerProps.className += " active-unit";
          wrapperProps.className += " active-unit-bg";
        }

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

        var containerElements =
        [
          React.DOM.div({className: "unit-image", key: "image"}),
          UIComponents.UnitInfo(infoProps),
        ];

        if (this.props.facesLeft)
        {
          containerElements = containerElements.reverse();
        }

        var allElements =
        [
          React.DOM.div(containerProps,
            containerElements
          ),
          UIComponents.UnitIcon(
            {
              icon: unit.template.icon,
              facesLeft: this.props.facesLeft,
              key: "icon"
            })
        ];

        if (this.props.facesLeft)
        {
          allElements = allElements.reverse();
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