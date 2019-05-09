import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import SfxFragment from "../../../modules/space/battlesfx/drawingfunctions/sfxfragments/SfxFragment";

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
  fragment: SfxFragment<any>;
  onValueChange: () => void;

  propProps: VecProp[];
}

interface StateType
{
}

export class SfxFragmentPropVecBaseComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "SfxFragmentPropVecBase";
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

const factory: React.Factory<PropTypes> = React.createFactory(SfxFragmentPropVecBaseComponent);
export default factory;
