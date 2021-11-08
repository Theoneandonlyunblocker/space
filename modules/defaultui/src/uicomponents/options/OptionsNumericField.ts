// TODO 2018.10.23 | why can't this & OptionsCheckBox be generic?

import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {NumberInput} from "../generic/NumberInput";


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
  public override state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }
  public override render()
  {
    const inputId = "" + this.props.id + "-input";

    return(
      ReactDOMElements.div(
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
        ReactDOMElements.label(
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

export const OptionsNumericField: React.Factory<PropTypes> = React.createFactory(OptionsNumericFieldComponent);
