import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../localization/localize";
import {Color} from "../../../../src/Color";
import {EmblemProps} from "../Emblem";

import {EmblemSetter} from "./EmblemSetter";


export interface PropTypes extends React.Props<any>
{
  backgroundColor: Color;
  emblems: (EmblemProps & {id: number})[];
  maxEmblems: number;

  toggleActiveEmblem: (id: number) => void;
  addEmblem: () => void;
  removeEmblem: (id: number) => void;
}

interface StateType
{
}

export class EmblemSetterListComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "EmblemSetterList";
  public state: StateType;


  constructor(props: PropTypes)
  {
    super(props);
  }

  render()
  {
    const canAddNewEmblem = this.props.emblems.length < this.props.maxEmblems;

    return(
      ReactDOMElements.ol(
      {
        className: "emblem-setter-list",
      },
        this.props.emblems.map(emblemProps =>
        {
          const id = emblemProps.id;

          return EmblemSetter(
          {
            key: id,

            toggleActive: this.props.toggleActiveEmblem.bind(null, id),
            remove: this.props.removeEmblem.bind(null, id),

            emblem: emblemProps,
            backgroundColor: this.props.backgroundColor,
          });
        }),
        ReactDOMElements.button(
        {
          className: "add-new-emblem-button",
          onClick: this.props.addEmblem,
          title: localize("addNewEmblem")(),
          disabled: !canAddNewEmblem,
        }),

      )
    );
  }
}

export const EmblemSetterList: React.Factory<PropTypes> = React.createFactory(EmblemSetterListComponent);
