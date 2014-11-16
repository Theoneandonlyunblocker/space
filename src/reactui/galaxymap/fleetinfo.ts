/// <reference path="../../eventmanager.ts"/>
/// <reference path="../../star.ts"/>

module Rance
{
  export module UIComponents
  {
    export var FleetInfo = React.createClass({

      render: function()
      {
        var fleet = this.props.fleet;
        


        return(
          React.DOM.div(
          {
            className: "fleet-info"
          },
            null
          )
        );
      }
    });
  }
}
