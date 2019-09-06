import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {Color} from "core/color/Color";
import {SubEmblemTemplate} from "core/templateinterfaces/SubEmblemTemplate";

import {ColorSetter} from "./ColorSetter";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
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
      ReactDOMElements.div(
      {
        className: "emblem-color-picker",
      },
        ReactDOMElements.div(
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
