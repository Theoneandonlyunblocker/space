import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {Color} from "core/src/color/Color";
import {activeModuleData} from "core/src/app/activeModuleData";

import {SubEmblemTemplate} from "core/src/templateinterfaces/SubEmblemTemplate";

import {Emblem} from "../Emblem";


export interface PropTypes extends React.Props<any>
{
  colors: Color[];
  backgroundColor: Color | null;
  selectedEmblemTemplate: SubEmblemTemplate | null;

  setEmblemTemplate: (emblem: SubEmblemTemplate | null, colors: Color[]) => void;
}

interface StateType
{
}

export class EmblemPickerComponent extends React.PureComponent<PropTypes, StateType>
{
  public displayName = "EmblemPicker";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  public render()
  {
    const emblemElements: React.ReactHTMLElement<any>[] = [];

    for (const emblemType in activeModuleData.templates.subEmblems)
    {
      const template = activeModuleData.templates.subEmblems[emblemType];

      let className = "emblem-picker-image";

      const templateIsSelected = this.props.selectedEmblemTemplate && this.props.selectedEmblemTemplate.key === template.key;
      if (templateIsSelected)
      {
        className += " selected-emblem";
      }

      emblemElements.push(
        ReactDOMElements.div(
        {
          className: "emblem-picker-container",
          key: template.key,
          onClick: this.handleSelectEmblem.bind(this, template),
          style: !this.props.backgroundColor ? null :
          {
            backgroundColor: "#" + this.props.backgroundColor.getHexString(),
          },
        },
          Emblem(
          {
            template: template,
            colors: this.props.colors,
            containerProps:
            {
              className: className,
            },
          }),
        ),
      );
    }

    return(
      ReactDOMElements.div(
      {
        className: "emblem-picker",
      },
        ReactDOMElements.div({className: "emblem-picker-emblem-list"},
          emblemElements,
        ),
      )
    );
  }

  private handleSelectEmblem(emblem: SubEmblemTemplate | null): void
  {
    if (this.props.selectedEmblemTemplate === emblem)
    {
      this.props.setEmblemTemplate(null, this.props.colors);
    }
    else
    {
      this.props.setEmblemTemplate(emblem, this.props.colors);
    }
  }
}

export const EmblemPicker: React.Factory<PropTypes> = React.createFactory(EmblemPickerComponent);
