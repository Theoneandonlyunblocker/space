import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {Unit} from "src/unit/Unit";

import {localize} from "../../localization/localize";


export interface PropTypes extends React.Props<any>
{
  unit: Unit;
  isNotDetected: boolean;
}

interface StateType
{
  inputElementValue: string;
}

export class FleetUnitInfoNameComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "FleetUnitInfoName";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.state = this.getInitialStateTODO();

    this.bindMethods();
  }
  private bindMethods()
  {
    this.onChange = this.onChange.bind(this);
  }

  private getInitialStateTODO(): StateType
  {
    return(
    {
      inputElementValue: this.props.unit.name,
    });
  }
  onChange(e: React.FormEvent<HTMLInputElement>)
  {
    const target = e.currentTarget;
    this.setState({inputElementValue: target.value});
    this.props.unit.name = target.value;
  }
  render()
  {
    return(
      ReactDOMElements.input(
      {
        className: "fleet-unit-info-name",
        value: this.props.isNotDetected ? localize("unidentifiedShip").toString() : this.state.inputElementValue,
        onChange: this.props.isNotDetected ? null :  this.onChange,
        readOnly: this.props.isNotDetected,
      })
    );
  }
}

export const FleetUnitInfoName: React.Factory<PropTypes> = React.createFactory(FleetUnitInfoNameComponent);
