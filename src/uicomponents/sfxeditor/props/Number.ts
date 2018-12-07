import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import SfxFragment from "../../../../modules/space/battlesfx/drawingfunctions/sfxfragments/SfxFragment";

import NumericTextInput from "../../generic/NumericTextInput";


interface PropTypes extends React.Props<any>
{
  propName: string;
  fragment: SfxFragment<any>;
  onValueChange: () => void;

  value: number;
}

interface StateType
{
}

export class SfxFragmentPropNumberComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "SfxFragmentPropNumber";
  public state: StateType;

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
      ReactDOMElements.div(
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

const factory: React.Factory<PropTypes> = React.createFactory(SfxFragmentPropNumberComponent);
export default factory;
