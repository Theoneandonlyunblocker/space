import * as React from "react";

import SFXFragment from "../../../../modules/common/battlesfxfunctions/sfxfragments/SFXFragment";

import InlineNumberProp from "./InlineNumberProp";

export interface VecProp
{
  key: string;
  label: string;
  value: number;
}

interface PropTypes extends React.Props<any>
{
  propName: string;
  fragment: SFXFragment<any>;
  onValueChange: () => void;

  propProps: VecProp[];
}

interface StateType
{
}

export class SFXFragmentPropVecBaseComponent extends React.Component<PropTypes, StateType>
{
  displayName = "SFXFragmentPropVecBase";
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  private handleValueChange(prop: VecProp, newValue: number): void
  {
    const valueIsValid = isFinite(newValue);

    if (!valueIsValid)
    {
      return;
    }

    this.props.fragment.props[this.props.propName][prop.key] = newValue;

    this.props.onValueChange();
  }

  render()
  {
    return(
      React.DOM.div(
      {
        className: "sfx-fragment-prop-vec-wrapper",
      },
        this.props.propProps.map(prop =>
        {
          return InlineNumberProp(
          {
            key: prop.key,
            propName: this.props.propName,
            label: prop.label,

            value: prop.value,
            onValueChange: this.handleValueChange.bind(this, prop),
          });
        }),
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(SFXFragmentPropVecBaseComponent);
export default Factory;
