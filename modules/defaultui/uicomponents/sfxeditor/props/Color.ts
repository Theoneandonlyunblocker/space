import * as React from "react";

import SfxFragment from "../../../../space/battlesfx/drawingfunctions/sfxfragments/SfxFragment";

import Color from "../../../../../src/Color";

import ColorSetter from "../../setupgame/ColorSetter";


export interface PropTypes extends React.Props<any>
{
  propName: string;
  fragment: SfxFragment<any>;
  onValueChange: () => void;

  color: Color;
}

interface StateType
{
}

export class SfxFragmentPropColorComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "SfxFragmentPropColor";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.onColorChange = this.onColorChange.bind(this);
  }

  private onColorChange(color: Color, isNull: boolean): void
  {
    if (isNull)
    {
      return;
    }

    this.props.fragment.props[this.props.propName] = color;

    this.props.onValueChange();
  }

  render()
  {
    return(
      ColorSetter(
      {
        color: this.props.color,
        onChange: this.onColorChange,
      })
    );
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(SfxFragmentPropColorComponent);
export default factory;
