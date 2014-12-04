module Rance
{
  export module UIComponents
  {
    export var FleetControls = React.createClass(
    {
      displayName: "FleetControls",

      deselectFleet: function()
      {
        eventManager.dispatchEvent("deselectFleet", this.props.fleet)
      },

      selectFleet: function()
      {
        eventManager.dispatchEvent("selectFleets", [this.props.fleet])
      },

      splitFleet: function()
      {
        eventManager.dispatchEvent("splitFleet", this.props.fleet)
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
              className: "fleet-controls-split",
              onClick: this.splitFleet
            },
              "split"
            ),
            React.DOM.button(
            {
              className: "fleet-controls-deselect",
              onClick: this.deselectFleet
            },
              "deselect"
            ),
            !this.props.hasMultipleSelected ? null : React.DOM.button(
            {
              className: "fleet-controls-select",
              onClick: this.selectFleet
            },
              "select"
            )
          )
        );
      }
    });
  }
}
