import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {VfxFragment} from "modules/common/src/combat/vfx/fragments/VfxFragment";

import {InlineNumberProp} from "./InlineNumberProp";


export interface VecProp
{
  key: string;
  label: string;
  value: number;
}

export interface PropTypes extends React.Props<any>
{
  propName: string;
  fragment: VfxFragment<any>;
  onValueChange: () => void;

  propProps: VecProp[];
}

interface StateType
{
}

export class VfxFragmentPropVecBaseComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "VfxFragmentPropVecBase";
  public state: StateType;

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
      ReactDOMElements.div(
      {
        className: "vfx-fragment-prop-vec-wrapper",
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

export const VfxFragmentPropVecBase: React.Factory<PropTypes> = React.createFactory(VfxFragmentPropVecBaseComponent);
