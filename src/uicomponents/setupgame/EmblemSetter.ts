/// <reference path="../../../lib/react-global.d.ts" />

import Color from "../../Color";
import SubEmblemTemplate from "../../templateinterfaces/SubEmblemTemplate";

import EmblemPicker from "./EmblemPicker";
import {default as EmblemComponent, EmblemProps} from "../Emblem";

interface PropTypes extends React.Props<any>
{
  isActive: boolean;
  toggleActive: () => void;
  remove: () => void;

  backgroundColor: Color | null;
  emblem: EmblemProps;

  setEmblemTemplate: (emblem: SubEmblemTemplate | null, color: Color) => void;
  setEmblemColor: (color: Color | null) => void;
}

interface StateType
{
}

export class EmblemSetterComponent extends React.PureComponent<PropTypes, StateType>
{
  displayName = "EmblemSetter";
  state: StateType;
  constructor(props: PropTypes)
  {
    super(props);
  }
  
  render()
  {
    return(
      React.DOM.div(
      {
        className: "emblem-setter",
      },
        EmblemComponent(
        {
          key: "emblem",
          template: this.props.emblem.template,
          colors: this.props.emblem.colors,
          containerProps:
          {
            style: !this.props.backgroundColor ? null :
            {
              backgroundColor: "#" + this.props.backgroundColor.getHexString()
            },
            onClick: this.props.toggleActive,
            onContextMenu: (e) =>
            {
              e.stopPropagation();
              e.preventDefault();
              this.props.remove();
            },
          }
        }),
        !this.props.isActive ? null :
          EmblemPicker(
          {
            key: "emblemPicker",
            color: this.props.emblem.colors[0],
            backgroundColor: this.props.backgroundColor,
            selectedEmblemTemplate: this.props.emblem.template,

            setEmblemTemplate: this.props.setEmblemTemplate,
            setEmblemColor: this.props.setEmblemColor,
          })
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(EmblemSetterComponent);
export default Factory;
