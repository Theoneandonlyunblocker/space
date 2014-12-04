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
      mixins: [React.addons.PureRenderMixin],
      render: function()
      {
        return(
          React.DOM.div({className: "unit-info"},
            React.DOM.div({className: "unit-info-name"},
              this.props.name
            ),
            UIComponents.UnitStatus(
            {
              guard: this.props.guard
            }),
            UIComponents.UnitStrength(
            {
              maxStrength: this.props.maxStrength,
              currentStrength: this.props.currentStrength,
              isSquadron: this.props.isSquadron
            }),
            UIComponents.UnitActions(
            {
              maxActionPoints: this.props.maxActionPoints,
              currentActionPoints: this.props.currentActionPoints
            })
          )
        );
      }
    });
  }
}
