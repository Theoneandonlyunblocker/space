import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import NumericTextInput from "../../generic/NumericTextInput";


interface PropTypes extends React.Props<any>
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
    const baseId = "sfx-fragment-prop-inline-number-" + this.props.propName + "-" + this.props.label;

    return(
      ReactDOMElements.div(
      {
        className: "sfx-fragment-prop-inline-number-wrapper",
      },
        ReactDOMElements.label(
        {
          className: "sfx-fragment-prop-inline-number-label",
          htmlFor: baseId,
        },
          `${this.props.label}:`,
        ),
        NumericTextInput(
        {
          value: this.props.value,
          valueStringIsValid: valueString => isFinite(Number(valueString)),
          getValueFromValueString: parseFloat,
          onValueChange: this.props.onValueChange,
        }),
      )
    );
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(InlineNumberPropComponent);
export default factory;
