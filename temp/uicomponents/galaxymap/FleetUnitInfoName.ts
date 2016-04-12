/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../../unit.ts" />


import Unit from "../../../src/Unit.ts";


export interface PropTypes extends React.Props<any>
{
  unit: Unit;
  isNotDetected: boolean;
}

interface StateType
{
  value?: any; // TODO refactor | define state type 456
}

export class FleetUnitInfoName_COMPONENT_TODO extends React.Component<PropTypes, StateType>
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
    this.onChange = this.onChange.bind(this);    
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

const Factory: React.Factory<PropTypes> = React.createFactory(FleetUnitInfoName_COMPONENT_TODO);
export default Factory;
