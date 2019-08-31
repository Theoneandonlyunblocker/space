import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../localization/localize";
import {Color} from "../../../../src/color/Color";
import {SubEmblemTemplate} from "../../../../src/templateinterfaces/SubEmblemTemplate";

import {EmblemColorPicker} from "./EmblemColorPicker";
import {EmblemPicker} from "./EmblemPicker";


export interface PropTypes extends React.Props<any>
{
  colors: (Color | null)[];
  backgroundColor: Color | null;
  selectedEmblemTemplate: SubEmblemTemplate | null;

  setEmblemTemplate: (emblem: SubEmblemTemplate | null, colors: Color[]) => void;
  setEmblemColors: (colors: (Color | null)[]) => void;
}

interface StateType
{
  colorPickerIsCollapsed: boolean;
  emblemPickerIsCollapsed: boolean;
}

export class EmblemEditorComponent extends React.PureComponent<PropTypes, StateType>
{
  public displayName = "EmblemEditor";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.state =
    {
      colorPickerIsCollapsed: false,
      emblemPickerIsCollapsed: false,
    };

    this.handleEmblemColorChange = this.handleEmblemColorChange.bind(this);
    this.toggleColorPickerCollapse = this.toggleColorPickerCollapse.bind(this);
    this.toggleEmblemPickerCollapse = this.toggleEmblemPickerCollapse.bind(this);
  }

  public render()
  {
    return(
      ReactDOMElements.div(
      {
        className: "emblem-editor",
      },
        ReactDOMElements.div(
        {
          className: "flag-picker-title"  + (this.state.colorPickerIsCollapsed ? " collapsed" : " collapsible"),
          onClick: this.toggleColorPickerCollapse,
        },
          localize("emblemColor")(),
        ),
        this.state.colorPickerIsCollapsed ?
          null :
          ReactDOMElements.div(
          {
            className: "emblem-color-pickers-container",
          },
            this.props.selectedEmblemTemplate.colorMappings.map((colorMappingData, i) =>
            {
              return EmblemColorPicker(
              {
                key: i,
                colors: this.props.colors,
                colorIndex: i,
                emblemTemplate: this.props.selectedEmblemTemplate,
                onColorChange: this.handleEmblemColorChange,
              });
            }),
          ),
        ReactDOMElements.div(
        {
          className: "flag-picker-title" + (this.state.emblemPickerIsCollapsed ? " collapsed" : " collapsible"),
          onClick: this.toggleEmblemPickerCollapse,
        },
          localize("emblems")(),
        ),
        this.state.emblemPickerIsCollapsed ?
          null :
          EmblemPicker(
          {
            colors: this.props.colors,
            backgroundColor: this.props.backgroundColor,
            selectedEmblemTemplate: this.props.selectedEmblemTemplate,

            setEmblemTemplate: this.props.setEmblemTemplate,
          }),
      )
    );
  }

  private handleEmblemColorChange(colors: (Color | null)[]): void
  {
    this.props.setEmblemColors(colors);
  }
  private toggleColorPickerCollapse(): void
  {
    this.setState({colorPickerIsCollapsed: !this.state.colorPickerIsCollapsed});
  }
  private toggleEmblemPickerCollapse(): void
  {
    this.setState({emblemPickerIsCollapsed: !this.state.emblemPickerIsCollapsed});
  }
}

export const EmblemEditor: React.Factory<PropTypes> = React.createFactory(EmblemEditorComponent);
