/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

import {clamp} from "../../utility";

interface PropTypes extends React.Props<any>
{
  onChangeFN: (value: number) => void;

  label: string;
  id: string;
  value: number;
  min: number;
  max: number;
  step: number;
}

interface StateType
{
  value?: number;
}

export class OptionsNumericFieldComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "OptionsNumericField";


  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.triggerOnChangeFN = this.triggerOnChangeFN.bind(this);
    this.handleChange = this.handleChange.bind(this);    
  }
  
  private getInitialState(): StateType
  {
    return(
    {
      value: this.props.value
    });
  }

  componentWillReceiveProps(newProps: PropTypes)
  {
    if (newProps.value !== this.state.value)
    {
      this.setState({value: newProps.value});
    }
  }
  

  triggerOnChangeFN()
  {
    this.props.onChangeFN(this.state.value);
  }

  handleChange(e: React.FormEvent)
  {
    var target = <HTMLInputElement> e.target;
    var value = parseFloat(target.value);

    if (!isFinite(value))
    {
      return;
    }

    value = clamp(value, parseFloat(target.min), parseFloat(target.max));

    this.setState(
    {
      value: value
    }, this.triggerOnChangeFN);
  }

  render()
  {
    var inputId = "" + this.props.id + "-input";

    return(
      React.DOM.div(
      {
        className: "options-numeric-field-container",
        id: this.props.id
      },
        React.DOM.input(
        {
          className: "options-numeric-field-input",
          type: "number",
          id: inputId,
          value: "" + this.state.value,
          min: this.props.min,
          max: this.props.max,
          step: this.props.step,
          onChange: this.handleChange
        },
          null
        ),
        React.DOM.label(
        {
          className: "options-numeric-field-label",
          htmlFor: inputId
        },
          this.props.label
        )
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(OptionsNumericFieldComponent);
export default Factory;