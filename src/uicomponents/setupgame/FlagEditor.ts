import * as React from "react";

import Color from "../../Color";
import Emblem from "../../Emblem";
import {Flag} from "../../Flag";

import SubEmblemTemplate from "../../templateinterfaces/SubEmblemTemplate";

import {EmblemProps} from "../Emblem";
import EmblemEditor from "./EmblemEditor";
import EmblemSetterList from "./EmblemSetterList";

import
{
  AutoPositionerProps,
  default as AutoPositioner,
} from "../mixins/AutoPositioner";
import applyMixins from "../mixins/applyMixins";

type EmblemPropsWithId = (EmblemProps & {id: number});

const maxEmblems = 4;

interface PropTypes extends React.Props<any>
{
  parentFlag: Flag | null;
  backgroundColor: Color | null;
  playerSecondaryColor: Color | null;

  updateParentFlag: (newFlag: Flag) => void;

  // handleSelectEmblem: (selectedEmblemTemplate: SubEmblemTemplate | null, color: Color) => void;
  // triggerParentUpdate: () => void;
  // uploadFiles: (files: FileList) => void;
  // failMessage: React.ReactElement<any>;
  // customImageFileName: string | null;

  autoPositionerProps?: AutoPositionerProps;
}

interface StateType
{
  emblems: EmblemPropsWithId[];
  activeEmblemSetterId: number | null;
}

export class FlagEditorComponent extends React.PureComponent<PropTypes, StateType>
{
  displayName = "FlagEditor";
  state: StateType;

  idGenerator = 0;

  constructor(props: PropTypes)
  {
    super(props);

    this.state =
    {
      emblems: this.getEmblemDataFromFlag(props.parentFlag),
      activeEmblemSetterId: null,
    };

    if (this.props.autoPositionerProps)
    {
      applyMixins(this, new AutoPositioner(this));
    }

    this.randomize = this.randomize.bind(this);
    this.generateFlag = this.generateFlag.bind(this);
    this.getEmblemDataFromFlag = this.getEmblemDataFromFlag.bind(this);
    this.addEmblem = this.addEmblem.bind(this);
    this.getEmblemProps = this.getEmblemProps.bind(this);
    this.removeEmblem = this.removeEmblem.bind(this);
    this.setEmblemTemplate = this.setEmblemTemplate.bind(this);
    this.setEmblemColors = this.setEmblemColors.bind(this);
    this.toggleActiveEmblemSetter = this.toggleActiveEmblemSetter.bind(this);
  }

  private static emblemDataToEmblem(emblemData: EmblemProps): Emblem
  {
    return new Emblem(
      emblemData.colors,
      emblemData.template,
      1,
    );
  }
  private static emblemToEmblemData(emblem: Emblem, id: number): EmblemPropsWithId
  {
    return(
    {
      colors: emblem.colors.slice(0),
      template: emblem.template,

      id: id,
    });
  }

  public randomize(): void
  {
    const flag = Flag.generateRandom(
      this.props.backgroundColor,
      this.props.playerSecondaryColor,
    );

    this.setState(
    {
      emblems: this.getEmblemDataFromFlag(flag),
    });
  }
  public generateFlag(): Flag
  {
    const emblems = this.state.emblems.map(emblemData => FlagEditorComponent.emblemDataToEmblem(emblemData));
    const flag = new Flag(this.props.backgroundColor, emblems);

    return flag;
  }
  public render()
  {
    const activeEmblemData = this.getActiveEmblemData();

    return(
      React.DOM.div(
      {
        className: "flag-editor",
      },
        EmblemSetterList(
        {
          backgroundColor: this.props.backgroundColor,
          emblems: this.state.emblems,
          maxEmblems: maxEmblems,

          toggleActiveEmblem: this.toggleActiveEmblemSetter,

          addEmblem: this.addEmblem,
          removeEmblem: this.removeEmblem,
        }),
        !activeEmblemData ? null :
        EmblemEditor(
        {
          key: "emblemEditor",
          colors: activeEmblemData.colors,
          backgroundColor: this.props.backgroundColor,
          selectedEmblemTemplate: activeEmblemData.template,

          setEmblemTemplate: this.setEmblemTemplate.bind(this, this.state.activeEmblemSetterId),
          setEmblemColors: this.setEmblemColors.bind(this, this.state.activeEmblemSetterId),
        }),
      )
    );
  }

  private triggerParentFlagUpdate(): void
  {
    this.props.updateParentFlag(this.generateFlag());
  }
  private getEmblemDataFromFlag(flag: Flag | null): EmblemPropsWithId[]
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
  private toggleActiveEmblemSetter(id: number): void
  {
    if (this.state.activeEmblemSetterId === id)
    {
      this.setState({activeEmblemSetterId: null});
    }
    else
    {
      this.setState({activeEmblemSetterId: id});
    }
  }
  private addEmblem(): void
  {
    const emblem = Emblem.generateRandom(this.props.backgroundColor);
    const emblemData = FlagEditorComponent.emblemToEmblemData(emblem, this.idGenerator++);

    this.setState(
    {
      emblems: this.state.emblems.concat([emblemData]),
    }, () =>
    {
      this.triggerParentFlagUpdate();
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
      }),
    }, () =>
    {
      this.triggerParentFlagUpdate();
    });
  }
  private setEmblemTemplate(id: number, template: SubEmblemTemplate | null): void
  {
    const emblem = this.getEmblemProps(id);
    emblem.template = template;

    this.triggerParentFlagUpdate();
  }
  private setEmblemColors(id: number, colors: (Color | null)[]): void
  {
    const emblem = this.getEmblemProps(id);
    emblem.colors = colors;

    this.triggerParentFlagUpdate();
  }
  private getActiveEmblemData(): EmblemPropsWithId | null
  {
    const id = this.state.activeEmblemSetterId;

    if (isFinite(id) && !isNaN(id))
    {
      for (let i = 0; i < this.state.emblems.length; i++)
      {
        if (this.state.emblems[i].id === id)
        {
          return this.state.emblems[i];
        }
      }
    }

    return null;
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(FlagEditorComponent);
export default Factory;
