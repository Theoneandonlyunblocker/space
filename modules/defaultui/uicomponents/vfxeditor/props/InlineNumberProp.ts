import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {NumberInput} from "../../generic/NumberInput";


export interface PropTypes extends React.Props<any>
{
  propName: string;
  label: string;

  value: number;
  onValueChange: (newValue: number) => void;
}

interface StateType
{
}

export class InlineNumberPropComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "InlineNumberProp";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  render()
  {
    const baseId = "vfx-fragment-prop-inline-number-" + this.props.propName + "-" + this.props.label;

    return(
      ReactDOMElements.div(
      {
        className: "vfx-fragment-prop-inline-number-wrapper",
      },
        ReactDOMElements.label(
        {
          className: "vfx-fragment-prop-inline-number-label",
          htmlFor: baseId,
        },
          `${this.props.label}:`,
        ),
        NumberInput(
        {
          value: this.props.value,
          valueStringIsValid: valueString => isFinite(Number(valueString)),
          getValueFromValueString: parseFloat,
          onChange: this.props.onValueChange,
        }),
      )
    );
  }
}

export const InlineNumberProp: React.Factory<PropTypes> = React.createFactory(InlineNumberPropComponent);
