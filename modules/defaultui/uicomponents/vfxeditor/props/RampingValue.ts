import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {VfxFragment} from "modules/space/battlevfx/drawingfunctions/vfxfragments/VfxFragment";

import {VfxFragmentPropVecBase} from "./VecBase";


export interface PropTypes extends React.Props<any>
{
  propName: string;
  fragment: VfxFragment<any>;
  onValueChange: () => void;

  base: number;
  up: number;
  down: number;
}

interface StateType
{
}

export class VfxFragmentPropRampingValueComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "VfxFragmentPropRampingValue";
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
        className: "vfx-fragment-prop-ramping-value",
      },
        VfxFragmentPropVecBase(
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

export const VfxFragmentPropRampingValue: React.Factory<PropTypes> = React.createFactory(VfxFragmentPropRampingValueComponent);

