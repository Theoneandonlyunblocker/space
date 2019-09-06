import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {Color} from "src/color/Color";

import {Emblem, EmblemProps} from "../Emblem";

import {localize} from "../../localization/localize";


export interface PropTypes extends React.Props<any>
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
  public displayName = "EmblemSetter";
  public state: StateType;
  constructor(props: PropTypes)
  {
    super(props);
  }

  render()
  {
    return(
      ReactDOMElements.div(
      {
        className: "emblem-setter",
      },
        Emblem(
        {
          key: "emblem",
          template: this.props.emblem.template,
          colors: this.props.emblem.colors,
          containerProps:
          {
            style: !this.props.backgroundColor ? null :
            {
              backgroundColor: "#" + this.props.backgroundColor.getHexString(),
            },
            title: `${this.props.emblem.template.key}\n\n${localize("emblemSetterTooltip")}`,
            onClick: this.props.toggleActive,
            onContextMenu: e =>
            {
              e.stopPropagation();
              e.preventDefault();
              this.props.remove();
            },
          },
        }),
      )
    );
  }
}

export const EmblemSetter: React.Factory<PropTypes> = React.createFactory(EmblemSetterComponent);
