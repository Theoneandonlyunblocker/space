import * as React from "react";

import Color from "../../Color";
import SubEmblemTemplate from "../../templateinterfaces/SubEmblemTemplate";

import ColorSetter from "./ColorSetter";


// tslint:disable-next-line:no-any
interface PropTypes extends React.Props<any>
{
  colors: Color[];
  colorIndex: number;
  emblemTemplate: SubEmblemTemplate;
  onColorChange: (colors: (Color | null)[]) => void;
}

interface StateType
{
}

export class EmblemColorPickerComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "EmblemColorPicker";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.handleColorChange = this.handleColorChange.bind(this);
  }

  public render()
  {
    const colorMappingData = this.props.emblemTemplate.colorMappings[this.props.colorIndex];

    return(
      React.DOM.div(
      {
        className: "emblem-color-picker",
      },
        React.DOM.div(
        {
          className: "emblem-color-picker-title",
        },
          colorMappingData.displayName,
        ),
        ColorSetter(
        {
          color: this.props.colors[this.props.colorIndex],
          onChange: this.handleColorChange,
          position:
          {
            xSide: "outerLeft",
            ySide: "innerTop",
          },
        }),
      )
    );
  }

  private handleColorChange(color: Color | null, isNull: boolean): void
  {
    this.props.colors[this.props.colorIndex] = isNull ? null : color;
    this.props.onColorChange(this.props.colors);
  }
}

// tslint:disable-next-line:variable-name
export const EmblemColorPicker: React.Factory<PropTypes> = React.createFactory(EmblemColorPickerComponent);
