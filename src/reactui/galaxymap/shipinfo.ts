/// <reference path="../unit/unitstrength.ts"/>

module Rance
{
  export module UIComponents
  {
    export var ShipInfo = React.createClass({

      render: function()
      {
        var ship = this.props.ship;
 
        return(
          React.DOM.div(
          {
            className: "ship-info"
          },
            React.DOM.div(
            {
              className: "ship-info-icon-container"
            },
              React.DOM.img(
              {
                className: "ship-info-icon",
                src: ship.template.icon
              })
            ),
            React.DOM.div(
            {
              className: "ship-info-info"
            },
              React.DOM.div(
              {
                className: "ship-info-name"
              },
                ship.name
              ),
              React.DOM.div(
              {
                className: "ship-info-type"
              },
                ship.template.typeName
              )
            ),
            UIComponents.UnitStrength(
            {
              maxStrength: ship.maxStrength,
              currentStrength: ship.currentStrength,
              isSquadron: true
            })
            
          )
        );
      }
    });
  }
}
