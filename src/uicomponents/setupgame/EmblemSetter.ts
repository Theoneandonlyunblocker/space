/// <reference path="../../../lib/react-global.d.ts" />

import Color from "../../Color";

import {default as EmblemComponent, EmblemProps} from "../Emblem";

interface PropTypes extends React.Props<any>
{
  toggleActive: () => void;
  remove: () => void;

  backgroundColor: Color | null;
  emblem: EmblemProps;
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
            title: "" + this.props.emblem.template.key + "\n\nLeft click to edit\nRight click to remove",
            onClick: this.props.toggleActive,
            onContextMenu: (e) =>
            {
              e.stopPropagation();
              e.preventDefault();
              this.props.remove();
            },
          }
        })
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(EmblemSetterComponent);
export default Factory;