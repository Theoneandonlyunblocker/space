import * as React from "react";

import SFXFragment from "../../../../modules/common/battlesfxfunctions/sfxfragments/SFXFragment";

import NumericTextInput from "../../generic/NumericTextInput";

interface PropTypes extends React.Props<any>
{
  propName: string;
  fragment: SFXFragment<any>;
  onValueChange: () => void;

  value: number;
}

interface StateType
{
}

export class SFXFragmentPropNumberComponent extends React.Component<PropTypes, StateType>
{
  displayName = "SFXFragmentPropNumber";
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  private handleChange(e: React.FormEvent<HTMLInputElement>): void
  {
    const target = e.currentTarget;
    const value = parseFloat(target.value);

    const valueIsValid = isFinite(value);

    if (!valueIsValid)
    {
      return;
    }

    this.props.fragment.props[this.props.propName] = value;

    this.props.onValueChange();
  }

  render()
  {
    return(
      React.DOM.div(
      {
        className: "sfx-fragment-prop-number-input",
      },
        NumericTextInput(
        {
          value: this.props.value,
          valueStringIsValid: valueString => isFinite(Number(valueString)),
          getValueFromValueString: parseFloat,
          onValueChange: newValue =>
          {
            this.props.fragment.props[this.props.propName] = newValue;

            this.props.onValueChange();
          },
        }),
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(SFXFragmentPropNumberComponent);
export default Factory;
