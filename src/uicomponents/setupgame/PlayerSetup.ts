/// <reference path="../../../lib/react-global-0.13.3.d.ts" />

import Player from "../../Player";
import Color from "../../Color";
import {default as FlagSetter, FlagSetterComponent} from "./FlagSetter";
import {default as ColorSetter, ColorSetterComponent} from "./ColorSetter";
import
{
  generateMainColor,
  generateSecondaryColor
} from "../../colorGeneration";

interface PropTypes extends React.Props<any>
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
  flagHasCustomImage?: boolean;
  name?: string;
  subColor?: Color;
  mainColor?: Color;
}

export class PlayerSetupComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "PlayerSetup";

  state: StateType;
  ref_TODO_flagSetter: FlagSetterComponent;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialStateTODO();
    
    this.bindMethods();
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
  }
  
  private getInitialStateTODO(): StateType
  {
    return(
    {
      name: this.props.initialName,
      mainColor: null,
      subColor: null,
      flagHasCustomImage: false
    });
  }
  generateMainColor(subColor = this.state.subColor)
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
    this.setState({subColor: isNull ? null : color});
  }
  handleRemove()
  {
    this.props.removePlayers([this.props.keyTODO/*TODO react*/]);
  }
  handleSetCustomImage(image?: string)
  {
    this.setState({flagHasCustomImage: Boolean(image)});
  }
  randomize()
  {
    if (!this.state.flagHasCustomImage)
    {
      this.ref_TODO_flagSetter.state.flag.generateRandom();
    }

    var mainColor = generateMainColor();

    this.setState(
    {
      mainColor: mainColor,
      subColor: generateSecondaryColor(mainColor)
    });
  }
  makePlayer()
  {
    var player = new Player(!this.props.isHuman);
    player.initTechnologies();

    player.name = this.state.name;
    
    player.color = this.state.mainColor === null ?
      this.generateMainColor() : this.state.mainColor;
    player.secondaryColor = this.state.subColor === null ?
      this.generateSubColor(player.color) : this.state.subColor;

    var flag = this.ref_TODO_flagSetter.state.flag;

    player.flag = flag;
    player.flag.setColorScheme(
      player.color,
      player.secondaryColor,
      flag.tetriaryColor
    );

    if (this.state.mainColor === null && this.state.subColor === null &&
      !flag.customImage && !flag.foregroundEmblem)
    {
      flag.generateRandom();
    }

    this.setState(
    {
      mainColor: player.color,
      subColor: player.secondaryColor
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
        ColorSetter(
        {
          // ref: (component: ColorSetterComponent) =>
          // {
          //   this.ref_TODO_mainColor = component;
          // },
          onChange: this.setMainColor,
          setActiveColorPicker: this.props.setActiveSetterComponent,
          generateColor: this.generateMainColor,
          flagHasCustomImage: this.state.flagHasCustomImage,
          color: this.state.mainColor
        }),
        ColorSetter(
        {
          // ref: (component: ColorSetterComponent) =>
          // {
          //   this.ref_TODO_subColor = component;
          // },
          onChange: this.setSubColor,
          setActiveColorPicker: this.props.setActiveSetterComponent,
          generateColor: this.generateSubColor,
          flagHasCustomImage: this.state.flagHasCustomImage,
          color: this.state.subColor
        }),
        FlagSetter(
        {
          ref: (component: FlagSetterComponent) =>
          {
            this.ref_TODO_flagSetter = component;
          },
          mainColor: this.state.mainColor,
          subColor: this.state.subColor,
          setActiveColorPicker: this.props.setActiveSetterComponent,
          toggleCustomImage: this.handleSetCustomImage
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
