/// <reference path="../../../../lib/react-global.d.ts" />

import SFXFragment from "../../../../modules/common/battlesfxfunctions/sfxfragments/SFXFragment";

import Color from "../../../Color";

import ColorSetter from "../../setupgame/ColorSetter";

interface PropTypes extends React.Props<any>
{
  propName: string;
  fragment: SFXFragment<any>;
  onValueChange: () => void;

  color: Color;
}

interface StateType
{
}

export class SFXFragmentPropColorComponent extends React.Component<PropTypes, StateType>
{
  displayName = "SFXFragmentPropColor";
  state: StateType;

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

const Factory: React.Factory<PropTypes> = React.createFactory(SFXFragmentPropColorComponent);
export default Factory;
