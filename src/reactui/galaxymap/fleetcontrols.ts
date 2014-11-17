module Rance
{
  export module UIComponents
  {
    export var FleetControls = React.createClass({

      deselectFleet: function()
      {
        eventManager.dispatchEvent("deselectFleet", this.props.fleet)
      },

      render: function()
      {
        return(
          React.DOM.div(
          {
            className: "fleet-controls"
          },
            React.DOM.button(
            {
              className: "fleet-controls-split"
            },
              "split"
            ),
            React.DOM.button(
            {
              className: "fleet-controls-deselect",
              onClick: this.deselectFleet
            },
              "deselect"
            )
          )
        );
      }
    });
  }
}
