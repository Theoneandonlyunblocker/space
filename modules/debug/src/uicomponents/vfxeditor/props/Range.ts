import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {VfxFragment} from "modules/common/src/combat/vfx/fragments/VfxFragment";

import {VfxFragmentPropVecBase} from "./VecBase";


export interface PropTypes extends React.Props<any>
{
  propName: string;
  fragment: VfxFragment<any>;
  onValueChange: () => void;

  min: number;
  max: number;
}

interface StateType
{
}

export class VfxFragmentPropRangeComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "VfxFragmentPropRange";
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
        className: "vfx-fragment-prop-range",
      },
        VfxFragmentPropVecBase(
        {
          propName: this.props.propName,
          fragment: this.props.fragment,
          onValueChange: this.props.onValueChange,

          propProps:
          [
            {
              key: "min",
              label: "Min",
              value: this.props.min,
            },
            {
              key: "max",
              label: "Max",
              value: this.props.max,
            },
          ],
        }),
      )
    );
  }
}

export const VfxFragmentPropRange: React.Factory<PropTypes> = React.createFactory(VfxFragmentPropRangeComponent);

