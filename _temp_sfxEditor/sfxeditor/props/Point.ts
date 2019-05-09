import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import SfxFragment from "../../../modules/space/battlesfx/drawingfunctions/sfxfragments/SfxFragment";

import SfxFragmentPropVecBase from "./VecBase";


interface PropTypes extends React.Props<any>
{
  propName: string;
  fragment: SfxFragment<any>;
  onValueChange: () => void;

  x: number;
  y: number;
}

interface StateType
{
}

export class SfxFragmentPropPointComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "SfxFragmentPropPoint";
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
        className: "sfx-fragment-prop-point",
      },
        SfxFragmentPropVecBase(
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

const factory: React.Factory<PropTypes> = React.createFactory(SfxFragmentPropPointComponent);
export default factory;

