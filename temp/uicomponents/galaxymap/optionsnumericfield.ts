/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

export interface PropTypes
{
  onChangeFN: reactTypeTODO_func; // (value: number) => void

  label: string;
  id: string;
  value: number;
  min: number;
  max: number;
  step: number;
}

interface StateType
{
  // TODO refactor | add state type
}

export default class OptionsNumericField extends React.Component<PropTypes, {}>
{
  displayName: string = "OptionsNumericField";


  state:
  {
    
  }

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  private getInitialState()
  {
    return(
    {
      value: this.props.value
    });
  }

  componentWillReceiveProps(newProps: any)
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

  handleChange(e: Event)
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
          value: this.state.value,
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
