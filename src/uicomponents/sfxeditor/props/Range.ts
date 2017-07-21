import * as React from "react";

import SFXFragment from "../../../../modules/common/battlesfxfunctions/sfxfragments/SFXFragment";

import SFXFragmentPropVecBase from "./VecBase";

interface PropTypes extends React.Props<any>
{
  propName: string;
  fragment: SFXFragment<any>;
  onValueChange: () => void;

  min: number;
  max: number;
}

interface StateType
{
}

export class SFXFragmentPropRangeComponent extends React.Component<PropTypes, StateType>
{
  displayName = "SFXFragmentPropRange";
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  render()
  {
    return(
      React.DOM.div(
      {
        className: "sfx-fragment-prop-range",
      },
        SFXFragmentPropVecBase(
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

const Factory: React.Factory<PropTypes> = React.createFactory(SFXFragmentPropRangeComponent);
export default Factory;

