import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {SfxFragment} from "../../../../space/battlesfx/drawingfunctions/sfxfragments/SfxFragment";

import {SfxFragmentPropVecBase} from "./VecBase";


export interface PropTypes extends React.Props<any>
{
  propName: string;
  fragment: SfxFragment<any>;
  onValueChange: () => void;

  base: number;
  up: number;
  down: number;
}

interface StateType
{
}

export class SfxFragmentPropRampingValueComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "SfxFragmentPropRampingValue";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  render()
  {
    return(
      ReactDOMElements.div(
      {
        className: "sfx-fragment-prop-ramping-value",
      },
        SfxFragmentPropVecBase(
        {
          propName: this.props.propName,
          fragment: this.props.fragment,
          onValueChange: this.props.onValueChange,

          propProps:
          [
            {
              key: "base",
              label: "base",
              value: this.props.base,
            },
            {
              key: "up",
              label: "up",
              value: this.props.up,
            },
            {
              key: "down",
              label: "down",
              value: this.props.down,
            },
          ],
        }),
      )
    );
  }
}

export const SfxFragmentPropRampingValue: React.Factory<PropTypes> = React.createFactory(SfxFragmentPropRampingValueComponent);

