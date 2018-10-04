import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import SfxFragment from "../../../../modules/common/battlesfxfunctions/sfxfragments/SfxFragment";

import SfxFragmentPropVecBase from "./VecBase";


interface PropTypes extends React.Props<any>
{
  propName: string;
  fragment: SfxFragment<any>;
  onValueChange: () => void;

  min: number;
  max: number;
}

interface StateType
{
}

export class SfxFragmentPropRangeComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "SfxFragmentPropRange";
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
        className: "sfx-fragment-prop-range",
      },
        SfxFragmentPropVecBase(
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

const factory: React.Factory<PropTypes> = React.createFactory(SfxFragmentPropRangeComponent);
export default factory;

