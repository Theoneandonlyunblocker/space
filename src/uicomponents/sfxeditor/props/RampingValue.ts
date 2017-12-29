import * as React from "react";

import SFXFragment from "../../../../modules/common/battlesfxfunctions/sfxfragments/SFXFragment";

import SFXFragmentPropVecBase from "./VecBase";

interface PropTypes extends React.Props<any>
{
  propName: string;
  fragment: SFXFragment<any>;
  onValueChange: () => void;

  base: number;
  up: number;
  down: number;
}

interface StateType
{
}

export class SFXFragmentPropRampingValueComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "SFXFragmentPropRampingValue";
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
        className: "sfx-fragment-prop-ramping-value",
      },
        SFXFragmentPropVecBase(
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

const Factory: React.Factory<PropTypes> = React.createFactory(SFXFragmentPropRampingValueComponent);
export default Factory;

