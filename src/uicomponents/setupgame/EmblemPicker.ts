/// <reference path="../../../lib/react-global.d.ts" />

import app from "../../App"; // TODO global
import Color from "../../Color";
import SubEmblemTemplate from "../../templateinterfaces/SubEmblemTemplate";

interface PropTypes extends React.Props<any>
{
  color: Color | null;
  backgroundColor: Color | null;
  emblem: SubEmblemTemplate | null;

  setEmblem(emblem: SubEmblemTemplate | null): void;
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
  }

  private handleSelectEmblem(emblem: SubEmblemTemplate | null): void
  {
    if (this.props.emblem === emblem)
    {
      this.props.setEmblem(null);
    }
    else
    {
      this.props.setEmblem(emblem);
    }
  }

  render()
  {
    const emblemElements: React.ReactHTMLElement<any>[] = [];

    for (let emblemType in app.moduleData.Templates.SubEmblems)
    {
      const template = app.moduleData.Templates.SubEmblems[emblemType];

      let className = "emblem-picker-image";

      const templateIsSelected = this.props.emblem && this.props.emblem.key === template.key;
      if (templateIsSelected)
      {
        className += " selected-emblem";
      }

      emblemElements.push(
        React.DOM.div(
        {
          className: "emblem-picker-container",
          key: template.key,
          onClick: this.handleSelectEmblem.bind(this, template)
        },
          React.DOM.img(
          {
            className: className,
            src: app.images[template.src].src
          })
        )
      );
    }

    return(
      React.DOM.div(
      {
        className: "emblem-picker",
        style:
        {
          backgroundColor: this.props.backgroundColor ?
            `#${this.props.backgroundColor.getHexString()}` :
            "magenta"
        }
      },
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
