/// <reference path="../../../lib/react-global.d.ts" />

import Color from "../../Color";
import SubEmblemTemplate from "../../templateinterfaces/SubEmblemTemplate";
// import Emblem from "../../Emblem";

import {default as EmblemSetter, EmblemSetterComponent} from "./EmblemSetter";
import {default as EmblemComponent, EmblemProps} from "../Emblem";

interface PropTypes extends React.Props<any>
{
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
      React.DOM.div(
      {
        className: "emblem-setter-list"
      },
        this.props.emblems.map(emblemProps =>
        {
          const id = emblemProps.id;
          EmblemSetter(
          {
            key: id,

            isActive: this.state.activeEmblemSetterID === id,
            toggleActive: this.toggleActiveEmblemSetter.bind(this, id),
            
            emblem: emblemProps,
            backgroundColor: null,

            setEmblemTemplate: this.props.setEmblemTemplate.bind(null, id),
            setEmblemColor: this.props.setEmblemColor.bind(null, id),
          });
        }),
         canAddNewEmblem ?
          React.DOM.button(
          {
            className: "emblem-setter-list-item add-new-emblem-button",
            onClick: this.props.addEmblem
          },
            "Add"
          ) :
          null

      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(EmblemSetterListComponent);
export default Factory;
