/// <reference path="../../../lib/react-global.d.ts" />

import app from "../../App"; // TODO global
import Player from "../../Player";
import Color from "../../Color";
import {Flag} from "../../Flag";
import
{
  generateMainColor,
  generateSecondaryColor
} from "../../colorGeneration";
import
{
  getRandomArrayItem,
} from "../../utility";

import {PlayerRaceTemplate} from "../../templateinterfaces/PlayerRaceTemplate";

import {default as FlagSetter, FlagSetterComponent} from "./FlagSetter";
import {default as ColorSetter, ColorSetterComponent} from "./ColorSetter";
import RacePicker from "./RacePicker";

export interface PropTypes extends React.Props<any>
{
  setActiveSetterComponent: (setter: ColorSetterComponent | FlagSetterComponent) => void;
  setHuman: (playerID: number) => void;
  removePlayers: (playerIDsToRemove: number[]) => void;
  initialName: string;
  keyTODO: number;
  isHuman: boolean;
}

interface StateType
{
  name?: string;
  secondaryColor?: Color;
  mainColor?: Color;
  race?: PlayerRaceTemplate;
}

function getRandomPlayerRaceTemplate(): PlayerRaceTemplate
{
  const candidateRaces = <PlayerRaceTemplate[]> Object.keys(app.moduleData.Templates.Races).map((raceKey) =>
  {
    return app.moduleData.Templates.Races[raceKey];
  }).filter((raceTemplate) =>
  {
    return !raceTemplate.isNotPlayable;
  });

  return getRandomArrayItem(candidateRaces);
}

export class PlayerSetupComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "PlayerSetup";

  state: StateType;

  flag: Flag;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialStateTODO();
    
    this.bindMethods();

    this.flag = new Flag(null);
  }
  private bindMethods()
  {
    this.randomize = this.randomize.bind(this);
    this.setSubColor = this.setSubColor.bind(this);
    this.generateSubColor = this.generateSubColor.bind(this);
    this.setMainColor = this.setMainColor.bind(this);
    this.generateMainColor = this.generateMainColor.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.makePlayer = this.makePlayer.bind(this);
    this.handleSetHuman = this.handleSetHuman.bind(this);
    this.handleSetCustomImage = this.handleSetCustomImage.bind(this);    
    this.setRace = this.setRace.bind(this);
  }
  
  private getInitialStateTODO(): StateType
  {
    return(
    {
      name: this.props.initialName,
      mainColor: null,
      secondaryColor: null,
      race: getRandomPlayerRaceTemplate(),
    });
  }
  componentWillUpdate(nextProps: PropTypes, nextState: StateType): void
  {
    this.flag.backgroundColor = nextState.mainColor;
  }
  generateMainColor(subColor = this.state.secondaryColor)
  {
    if (subColor === null)
    {
      return generateMainColor();
    }
    else
    {
      return generateSecondaryColor(subColor);
    }
  }
  generateSubColor(mainColor = this.state.mainColor)
  {
    if (mainColor === null)
    {
      return generateMainColor();
    }
    else
    {
      return generateSecondaryColor(mainColor);
    }
  }
  handleSetHuman()
  {
    this.props.setHuman(this.props.keyTODO/*TODO react*/);
  }

  handleNameChange(e: React.FormEvent)
  {
    var target = <HTMLInputElement> e.target;
    this.setState({name: target.value});
  }

  setMainColor(color: Color, isNull: boolean)
  {
    this.setState({mainColor: isNull ? null : color});
  }
  setSubColor(color: Color, isNull: boolean)
  {
    this.setState({secondaryColor: isNull ? null : color});
  }
  handleRemove()
  {
    this.props.removePlayers([this.props.keyTODO/*TODO react*/]);
  }
  handleSetCustomImage(image?: string)
  {
    // this.setState({flagHasCustomImage: Boolean(image)});
  }
  private setRace(race: PlayerRaceTemplate): void
  {
    this.setState(
    {
      race: race
    });
  }
  public randomize(): void
  {
    const mainColor = generateMainColor();
    const secondaryColor = generateSecondaryColor(mainColor);

    this.flag = Flag.generateRandom(mainColor, secondaryColor);

    this.setState(
    {
      mainColor: mainColor,
      secondaryColor: secondaryColor,
      race: getRandomPlayerRaceTemplate(),
    });
  }
  makePlayer()
  {
    const mainColor = this.state.mainColor || this.generateMainColor();
    const secondaryColor = this.state.secondaryColor || this.generateSubColor(mainColor);

    if (!this.flag.backgroundColor)
    {
      this.flag = Flag.generateRandom(mainColor, secondaryColor);
    }
    
    const player = new Player(
    {
      isAI: !this.props.isHuman,
      isIndependent: false,

      race: this.state.race,
      money: 1000,

      name: this.state.name,

      color:
      {
        main: mainColor,
        secondary: secondaryColor,
        alpha: 1
      },

      flag: this.flag
    });

    this.setState(
    {
      mainColor: player.color,
      secondaryColor: player.secondaryColor
    });

    return player;
  }
  render()
  {
    return(
      React.DOM.div(
      {
        className: "player-setup" + (this.props.isHuman ? " human-player-setup" : "")
      },
        React.DOM.input(
        {
          className: "player-setup-is-human",
          type: "checkbox",
          checked: this.props.isHuman,
          onChange: this.handleSetHuman
        }),
        React.DOM.input(
        {
          className: "player-setup-name",
          value: this.state.name,
          onChange: this.handleNameChange
        }),
        RacePicker(
        {
          availableRaces: Object.keys(app.moduleData.Templates.Races).map((raceKey) =>
          {
            return app.moduleData.Templates.Races[raceKey];
          }).filter((race) =>
          {
            return !race.isNotPlayable;
          }),
          selectedRace: this.state.race,
          changeRace: this.setRace
        }),
        ColorSetter(
        {
          onChange: this.setMainColor,
          setAsActive: this.props.setActiveSetterComponent,
          generateColor: this.generateMainColor,
          color: this.state.mainColor
        }),
        ColorSetter(
        {
          onChange: this.setSubColor,
          setAsActive: this.props.setActiveSetterComponent,
          generateColor: this.generateSubColor,
          color: this.state.secondaryColor
        }),
        FlagSetter(
        {
          flag: this.flag,
          mainColor: this.state.mainColor,
          secondaryColor: this.state.secondaryColor,
          setAsActive: this.props.setActiveSetterComponent,
          updateParentFlag: (flag) =>
          {
            this.flag = flag;
            this.forceUpdate();
          }
        }),
        React.DOM.button(
        {
          className: "player-setup-remove-player",
          onClick: this.handleRemove
        }, "X")
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(PlayerSetupComponent);
export default Factory;
