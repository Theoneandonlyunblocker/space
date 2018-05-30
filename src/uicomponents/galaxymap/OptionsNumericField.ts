import * as React from "react";

import {default as NumberInput} from "../generic/NumberInput";


export interface PropTypes extends React.Props<any>
{
  onChange: (value: number) => void;

  label: string;
  id: string;
  value: number;
  min: number;
  max: number;
  step: number;
}

interface StateType
{
}

export class OptionsNumericFieldComponent extends React.Component<PropTypes, StateType>
{
  public displayName: string = "OptionsNumericField";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }
  public render()
  {
    const inputId = "" + this.props.id + "-input";

    return(
      React.DOM.div(
      {
        className: "options-numeric-field-container",
        id: this.props.id,
      },
        NumberInput(
        {
          attributes:
          {
            className: "options-numeric-field-input",
            id: inputId,
          },
          value: this.props.value,
          onChange: this.props.onChange,

          min: this.props.min,
          max: this.props.max,
          step: this.props.step,
        }),
        React.DOM.label(
        {
          className: "options-numeric-field-label",
          htmlFor: inputId,
        },
          this.props.label,
        ),
      )
    );
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(OptionsNumericFieldComponent);
export default factory;
