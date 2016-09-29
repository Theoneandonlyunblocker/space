/// <reference path="../../../lib/react-global.d.ts" />

import app from "../../App"; // TODO global
import Color from "../../Color";
import {generateSecondaryColor} from "../../colorGeneration";
import Emblem from "../../Emblem";
import Flag from "../../Flag";
import SubEmblemTemplate from "../../templateinterfaces/SubEmblemTemplate";

import ColorPicker from "./ColorPicker";
import PlayerFlag from "../PlayerFlag";

interface PropTypes extends React.Props<any>
{
  color: Color | null;
  backgroundColor: Color | null;
  selectedEmblemTemplate: SubEmblemTemplate | null;

  setEmblemTemplate(emblem: SubEmblemTemplate | null, color: Color): void;
  setEmblemColor(color: Color | null): void;
}

interface StateType
{
}

export class EmblemPickerComponent extends React.PureComponent<PropTypes, StateType>
{
  displayName = "EmblemPicker";
  state: StateType;
  
  constructor(props: PropTypes)
  {
    super(props);

    this.handleEmblemColorChange = this.handleEmblemColorChange.bind(this);
  }

  private handleSelectEmblem(emblem: SubEmblemTemplate | null): void
  {
    if (this.props.selectedEmblemTemplate === emblem)
    {
      this.props.setEmblemTemplate(null, this.props.color);
    }
    else
    {
      this.props.setEmblemTemplate(emblem, this.props.color);
    }
  }
  private handleEmblemColorChange(color: Color, isNull: boolean): void
  {
    this.props.setEmblemColor(isNull ? null : color);
  }

  render()
  {
    const emblemElements: React.ReactHTMLElement<any>[] = [];

    for (let emblemType in app.moduleData.Templates.SubEmblems)
    {
      const template = app.moduleData.Templates.SubEmblems[emblemType];

      let className = "emblem-picker-image";

      const templateIsSelected = this.props.selectedEmblemTemplate && this.props.selectedEmblemTemplate.key === template.key;
      if (templateIsSelected)
      {
        className += " selected-emblem";
      }

      const flag = new Flag(this.props.backgroundColor);

      const emblem = new Emblem([this.props.color], template, 1);
      flag.addEmblem(emblem);

      emblemElements.push(
        React.DOM.div(
        {
          className: "emblem-picker-container",
          key: template.key,
          onClick: this.handleSelectEmblem.bind(this, template)
        },
          PlayerFlag(
          {
            flag: flag,
            isMutable: true,
            props:
            {
              className: className,
            }
          })
        )
      );
    }

    return(
      React.DOM.div(
      {
        className: "emblem-picker",
      },
        React.DOM.div({className: "flag-picker-title"},
          "Emblem color"
        ),
        ColorPicker(
        {
          initialColor: this.props.color,
          onChange: this.handleEmblemColorChange,
          generateColor: () =>
          {
            return generateSecondaryColor(this.props.backgroundColor);
          }
        }),
        React.DOM.div({className: "flag-picker-title"},
          "Emblems"
        ),
        React.DOM.div({className: "emblem-picker-emblem-list"},
          emblemElements
        )
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(EmblemPickerComponent);
export default Factory;
