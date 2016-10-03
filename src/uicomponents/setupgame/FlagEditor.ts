/// <reference path="../../../lib/react-global.d.ts" />

import Color from "../../Color";
import {generateMainColor, generateSecondaryColor} from "../../colorGeneration";
import Emblem from "../../Emblem";
import Flag from "../../Flag";

import SubEmblemTemplate from "../../templateinterfaces/SubEmblemTemplate";

import EmblemSetterList from "./EmblemSetterList";
import {default as EmblemComponent, EmblemProps} from "../Emblem";

type EmblemPropsWithID = (EmblemProps & {id: number});

const maxEmblems = 4;

interface PropTypes extends React.Props<any>
{
  initialFlag: Flag | null;
  backgroundColor: Color | null;
  playerSecondaryColor: Color | null;
}

interface StateType
{
  emblems: EmblemPropsWithID[];
}

export class FlagEditorComponent extends React.Component<PropTypes, StateType>
{
  displayName = "FlagEditor";
  state: StateType;

  idGenerator = 0;
  
  constructor(props: PropTypes)
  {
    super(props);

    this.state =
    {
      emblems: this.getEmblemDataFromFlag(props.initialFlag)
    }
  }
  private getEmblemDataFromFlag(flag: Flag | null): EmblemPropsWithID[]
  {
    if (!flag)
    {
      return [];
    }
    else
    {
      return flag.emblems.map(emblem => FlagEditorComponent.emblemToEmblemData(emblem, this.idGenerator++));
    }
  }

  public randomize(): void
  {
    const flag = Flag.generateRandom(
      this.props.backgroundColor,
      this.props.playerSecondaryColor
    );

    this.setState(
    {
      emblems: this.getEmblemDataFromFlag(flag)
    });
  }

  public generateFlag(): Flag
  {
    const emblems = this.state.emblems.map(emblemData => FlagEditorComponent.emblemDataToEmblem(emblemData));
    const flag = new Flag(this.props.backgroundColor, emblems);

    return flag;
  }

  private static emblemDataToEmblem(emblemData: EmblemProps): Emblem
  {
    return new Emblem(
      emblemData.colors,
      emblemData.template,
      1
    );
  }
  private static emblemToEmblemData(emblem: Emblem, id: number): EmblemPropsWithID
  {
    return(
    {
      colors: emblem.colors.slice(0),
      template: emblem.template,

      id: id,
    });
  }
  private getRandomColorForEmblem(): Color
  {
    if (!this.props.backgroundColor)
    {
      return generateMainColor();
    }
    else
    {
      return generateSecondaryColor(this.props.backgroundColor);
    }
  }
  private addEmblem(): void
  {
    const emblem = Emblem.generateRandom(this.props.backgroundColor);
    const emblemData = FlagEditorComponent.emblemToEmblemData(emblem, this.idGenerator++);

    this.setState(
    {
      emblems: this.state.emblems.concat([emblemData])
    });
  }

  private getEmblemProps(id: number): EmblemProps | null
  {
    for (let i = 0; i < this.state.emblems.length; i++)
    {
      if (this.state.emblems[i].id === id)
      {
        return this.state.emblems[i];
      }
    }

    return null;
  }
  private removeEmblem(idToFilter: number): void
  {
    this.setState(
    {
      emblems: this.state.emblems.filter(emblemProps =>
      {
        return emblemProps.id !== idToFilter;
      })
    });
  }
  private setEmblemTemplate(id: number, template: SubEmblemTemplate | null): void
  {
    const emblem = this.getEmblemProps(id);
    emblem.template = template;

    this.forceUpdate();
  }
  private setEmblemColor(id: number, color: Color | null): void
  {
    const emblem = this.getEmblemProps(id);
    emblem.colors = [color];

    this.forceUpdate();
  }
  
  render()
  {
    return(
      React.DOM.div(
      {
        className: "flag-editor"
      },
        EmblemSetterList(
        {
          emblems: this.state.emblems,
          maxEmblems: maxEmblems,

          addEmblem: this.addEmblem,
          removeEmblem: this.removeEmblem,

          setEmblemTemplate: this.setEmblemTemplate,
          setEmblemColor: this.setEmblemColor,
          
        })
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(FlagEditorComponent);
export default Factory;
