/// <reference path="../../fleet.ts" />

export interface PropTypes
{
  fleet: Fleet;
  isInspecting?: boolean;
  hasMultipleSelected?: boolean;
}

export default class FleetControls extends React.Component<PropTypes, {}>
{
  displayName: "FleetControls";


  deselectFleet: function()
  {
    eventManager.dispatchEvent("deselectFleet", this.props.fleet);
  }

  selectFleet: function()
  {
    eventManager.dispatchEvent("selectFleets", [this.props.fleet]);
  }

  splitFleet: function()
  {
    eventManager.dispatchEvent("splitFleet", this.props.fleet);
  }

  render: function()
  {
    var fleet: Rance.Fleet = this.props.fleet;

    var splitButtonProps: any =
    {
      className: "fleet-controls-split"
    };
    if (fleet.units.length > 1 && !this.props.isInspecting)
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
}
