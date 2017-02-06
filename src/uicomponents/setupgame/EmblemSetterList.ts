/// <reference path="../../../lib/react-global.d.ts" />

import Color from "../../Color";

import {EmblemProps} from "../Emblem";
import EmblemSetter from "./EmblemSetter";

interface PropTypes extends React.Props<any>
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
  displayName = "EmblemSetterList";
  state: StateType;


  constructor(props: PropTypes)
  {
    super(props);
  }

  render()
  {
    const canAddNewEmblem = this.props.emblems.length < this.props.maxEmblems;

    return(
      React.DOM.ol(
      {
        className: "emblem-setter-list"
      },
        this.props.emblems.map((emblemProps) =>
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
        React.DOM.button(
        {
          className: "add-new-emblem-button",
          onClick: this.props.addEmblem,
          title: "Add new emblem",
          disabled: !canAddNewEmblem
        })

      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(EmblemSetterListComponent);
export default Factory;
