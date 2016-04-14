/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react/addons";

import Unit from "../../Unit";


interface PropTypes extends React.Props<any>
{
  unit: Unit;
  isNotDetected: boolean;
}

interface StateType
{
  inputElementValue?: string;
}

export class FleetUnitInfoNameComponent extends React.Component<PropTypes, StateType>
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
      inputElementValue: this.props.unit.name
    });
  }
  onChange(e: React.FormEvent)
  {
    var target = <HTMLInputElement> e.target;
    this.setState({inputElementValue: target.value});
    this.props.unit.name = target.value;
  }
  render()
  {
    return(
      React.DOM.input(
      {
        className: "fleet-unit-info-name",
        value: this.props.isNotDetected ? "Unidentified ship" : this.state.inputElementValue,
        onChange: this.props.isNotDetected ? null :  this.onChange,
        readOnly: this.props.isNotDetected
      })
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(FleetUnitInfoNameComponent);
export default Factory;
