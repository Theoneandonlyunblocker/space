import * as React from "react";

import {VfxFragment} from "modules/space/battlevfx/drawingfunctions/vfxfragments/VfxFragment";

import {Color} from "core/color/Color";

import {ColorSetter} from "../../setupgame/ColorSetter";


export interface PropTypes extends React.Props<any>
{
  propName: string;
  fragment: VfxFragment<any>;
  onValueChange: () => void;

  color: Color;
}

interface StateType
{
}

export class VfxFragmentPropColorComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "VfxFragmentPropColor";
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

export const VfxFragmentPropColor: React.Factory<PropTypes> = React.createFactory(VfxFragmentPropColorComponent);
