/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../../unit.ts" />

export interface PropTypes
{
  unit: Unit;
  isNotDetected: boolean;
}

export default class FleetUnitInfoName extends React.Component<PropTypes, {}>
{
  displayName: string = "FleetUnitInfoName";


  getInitialState()
  {
    return(
    {
      value: this.props.unit.name
    });
  }
  onChange(e: Event)
  {
    var target = <HTMLInputElement> e.target;
    this.setState({value: target.value});
    this.props.unit.name = target.value;
  }
  render()
  {
    return(
      React.DOM.input(
      {
        className: "fleet-unit-info-name",
        value: this.props.isNotDetected ? "Unidentified ship" : this.state.value,
        onChange: this.props.isNotDetected ? null :  this.onChange,
        readOnly: this.props.isNotDetected
      })
    );
  }
}
