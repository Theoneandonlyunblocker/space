import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {VfxFragment} from "modules/common/src/combat/vfx/fragments/VfxFragment";

import {NumberInput} from "modules/defaultui/src/uicomponents/generic/NumberInput";


export interface PropTypes extends React.Props<any>
{
  propName: string;
  fragment: VfxFragment<any>;
  onValueChange: () => void;

  value: number;
}

interface StateType
{
}

export class VfxFragmentPropNumberComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "VfxFragmentPropNumber";
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
        className: "vfx-fragment-prop-number-input",
      },
        NumberInput(
        {
          value: this.props.value,
          onChange: newValue =>
          {
            this.props.fragment.props[this.props.propName] = newValue;

            this.props.onValueChange();
          },
        }),
      )
    );
  }
}

export const VfxFragmentPropNumber: React.Factory<PropTypes> = React.createFactory(VfxFragmentPropNumberComponent);
