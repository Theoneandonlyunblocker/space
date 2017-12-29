import * as React from "react";

import SFXFragment from "../../../../modules/common/battlesfxfunctions/sfxfragments/SFXFragment";

import SFXFragmentPropVecBase from "./VecBase";

interface PropTypes extends React.Props<any>
{
  propName: string;
  fragment: SFXFragment<any>;
  onValueChange: () => void;

  x: number;
  y: number;
}

interface StateType
{
}

export class SFXFragmentPropPointComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "SFXFragmentPropPoint";
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
        className: "sfx-fragment-prop-point",
      },
        SFXFragmentPropVecBase(
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

const Factory: React.Factory<PropTypes> = React.createFactory(SFXFragmentPropPointComponent);
export default Factory;

