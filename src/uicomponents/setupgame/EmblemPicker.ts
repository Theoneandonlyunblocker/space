import * as React from "react";

import Color from "../../Color";
import {activeModuleData} from "../../activeModuleData";

import SubEmblemTemplate from "../../templateinterfaces/SubEmblemTemplate";

import EmblemComponent from "../Emblem";


interface PropTypes extends React.Props<any>
{
  colors: Color[];
  backgroundColor: Color | null;
  selectedEmblemTemplate: SubEmblemTemplate | null;

  setEmblemTemplate: (emblem: SubEmblemTemplate | null, colors: Color[]) => void;
}

interface StateType
{
}

export class EmblemEditorComponent extends React.PureComponent<PropTypes, StateType>
{
  public displayName = "EmblemEditor";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  public render()
  {
    const emblemElements: React.ReactHTMLElement<any>[] = [];

    for (const emblemType in activeModuleData.templates.SubEmblems)
    {
      const template = activeModuleData.templates.SubEmblems[emblemType];

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
            backgroundColor: "#" + this.props.backgroundColor.getHexString(),
          },
        },
          EmblemComponent(
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
      React.DOM.div(
      {
        className: "emblem-picker",
      },
        React.DOM.div({className: "emblem-picker-emblem-list"},
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

const factory: React.Factory<PropTypes> = React.createFactory(EmblemEditorComponent);
export default factory;
