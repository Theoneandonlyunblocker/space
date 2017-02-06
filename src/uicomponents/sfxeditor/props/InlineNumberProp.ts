/// <reference path="../../../../lib/react-global.d.ts" />

import ControlledNumberInput from "../../generic/ControlledNumberInput";

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
  displayName = "InlineNumberProp";
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  render()
  {
    const baseID = "sfx-fragment-prop-inline-number-" + this.props.propName + "-" + this.props.label;

    return(
      React.DOM.div(
      {
        className: "sfx-fragment-prop-inline-number-wrapper"
      },
        React.DOM.label(
        {
          className: "sfx-fragment-prop-inline-number-label",
          htmlFor: baseID
        },
          this.props.label + ":",
        ),
        ControlledNumberInput(
        {
          value: this.props.value,
          valueStringIsValid: (valueString) => isFinite(Number(valueString)),
          getValueFromValueString: parseFloat,
          onValueChange: this.props.onValueChange
        })
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(InlineNumberPropComponent);
export default Factory;
