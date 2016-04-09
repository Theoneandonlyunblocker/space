/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../../unit.ts" />

export interface PropTypes
{
  unit: Unit;
  isNotDetected: boolean;
}

interface StateType
{
  // TODO refactor | add state type
}

class FleetUnitInfoName extends React.Component<PropTypes, StateType>
{
  displayName: string = "FleetUnitInfoName";


  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  private getInitialState(): StateType
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
