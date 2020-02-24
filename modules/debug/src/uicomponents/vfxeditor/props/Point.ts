import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {VfxFragment} from "modules/common/src/combat/vfx/fragments/VfxFragment";

import {VfxFragmentPropVecBase} from "./VecBase";


export interface PropTypes extends React.Props<any>
{
  propName: string;
  fragment: VfxFragment<any>;
  onValueChange: () => void;

  x: number;
  y: number;
}

interface StateType
{
}

export class VfxFragmentPropPointComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "VfxFragmentPropPoint";
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
        className: "vfx-fragment-prop-point",
      },
        VfxFragmentPropVecBase(
        {
          propName: this.props.propName,
          fragment: this.props.fragment,
          onValueChange: this.props.onValueChange,

          propProps:
          [
            {
              key: "x",
              label: "X",
              value: this.props.x,
            },
            {
              key: "y",
              label: "Y",
              value: this.props.y,
            },
          ],
        }),
      )
    );
  }
}

export const VfxFragmentPropPoint: React.Factory<PropTypes> = React.createFactory(VfxFragmentPropPointComponent);

