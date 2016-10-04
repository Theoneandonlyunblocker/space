/// <reference path="../../../lib/react-global.d.ts" />

import app from "../../App"; // TODO global
import Color from "../../Color";
import {generateMainColor, generateSecondaryColor} from "../../colorGeneration";
import SubEmblemTemplate from "../../templateinterfaces/SubEmblemTemplate";

import ColorPicker from "./ColorPicker";
import EmblemComponent from "../Emblem";

interface PropTypes extends React.Props<any>
{
  color: Color | null;
  backgroundColor: Color | null;
  selectedEmblemTemplate: SubEmblemTemplate | null;

  setEmblemTemplate: (emblem: SubEmblemTemplate | null, color: Color) => void;
  setEmblemColor: (color: Color | null) => void;
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

      emblemElements.push(
        React.DOM.div(
        {
          className: "emblem-picker-container",
          key: template.key,
          onClick: this.handleSelectEmblem.bind(this, template),
          style: !this.props.backgroundColor ? null :
          {
            backgroundColor: "#" + this.props.backgroundColor.getHexString()
          }
        },
          EmblemComponent(
          {
            template: template,
            colors: [this.props.color],
            containerProps:
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
            if (this.props.backgroundColor)
            {
              return generateSecondaryColor(this.props.backgroundColor);
            }
            else
            {
              return generateMainColor();
            }
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
