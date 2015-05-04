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
        var splitButtonProps: any =
        {
          className: "fleet-controls-split"
        };
        if (this.props.fleet.ships.length > 1)
        {
          splitButtonProps.onClick = this.splitFleet;
        }
        else
        {
          splitButtonProps.className += " disabled";
          splitButtonProps.disabled = true;
        }
        return(
          React.DOM.div(
          {
            className: "fleet-controls"
          },
            React.DOM.button(splitButtonProps,
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
