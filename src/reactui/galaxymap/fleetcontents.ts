/// <reference path="shipinfo.ts"/>

module Rance
{
  export module UIComponents
  {
    export var FleetContents = React.createClass({

      render: function()
      {
        var shipInfos = [];

        for (var i = 0; i < this.props.fleet.ships.length; i++)
        {
          shipInfos.push(UIComponents.ShipInfo(
          {
            key: this.props.fleet.ships[i].id,
            ship: this.props.fleet.ships[i]
          }));
        }

        return(
          React.DOM.div(
          {
            className: "fleet-contents"
          },
            shipInfos
          )
        );
      }

    });
  }
}
