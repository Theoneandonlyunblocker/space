/// <reference path="../../../lib/react-global.d.ts" />

import Color from "../../Color";
import SubEmblemTemplate from "../../templateinterfaces/SubEmblemTemplate";

import EmblemSetter from "./EmblemSetter";
import {EmblemProps} from "../Emblem";

interface PropTypes extends React.Props<any>
{
  backgroundColor: Color;
  emblems: (EmblemProps & {id: number})[];
  maxEmblems: number;

  addEmblem: () => void;
  removeEmblem: (id: number) => void;
  setEmblemTemplate: (id: number, emblem: SubEmblemTemplate | null) => void;
  setEmblemColor: (id: number, color: Color | null) => void;
}

interface StateType
{
  activeEmblemSetterID: number | null;
}

export class EmblemSetterListComponent extends React.Component<PropTypes, StateType>
{
  displayName = "EmblemSetterList";
  state: StateType;

  
  constructor(props: PropTypes)
  {
    super(props);

    this.state =
    {
      activeEmblemSetterID: null
    }
  }

  private toggleActiveEmblemSetter(id: number): void
  {
    if (this.state.activeEmblemSetterID === id)
    {
      this.setState({activeEmblemSetterID: null});
    }
    else
    {
      this.setState({activeEmblemSetterID: id});
    }
  }
  
  render()
  {
    const canAddNewEmblem = this.props.emblems.length < this.props.maxEmblems;
    
    return(
      React.DOM.ol(
      {
        className: "emblem-setter-list"
      },
        this.props.emblems.map(emblemProps =>
        {
          const id = emblemProps.id;
          return EmblemSetter(
          {
            key: id,

            isActive: this.state.activeEmblemSetterID === id,
            toggleActive: this.toggleActiveEmblemSetter.bind(this, id),
            remove: this.props.removeEmblem.bind(null, id),
            
            emblem: emblemProps,
            backgroundColor: this.props.backgroundColor,

            setEmblemTemplate: this.props.setEmblemTemplate.bind(null, id),
            setEmblemColor: this.props.setEmblemColor.bind(null, id),
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
