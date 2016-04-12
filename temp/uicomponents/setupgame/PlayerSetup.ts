/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="colorsetter.ts" />
/// <reference path="flagsetter.ts" />


import Player from "../../../src/Player.ts";
import FlagSetter from "./FlagSetter.ts";
import ColorSetter from "./ColorSetter.ts";


export interface PropTypes extends React.Props<any>
{
  setActiveColorPicker: any; // TODO refactor | define prop type 123
  setHuman: any; // TODO refactor | define prop type 123
  removePlayers: any; // TODO refactor | define prop type 123
  initialName: any; // TODO refactor | define prop type 123
  keyTODO: any; // TODO refactor | define prop type 123
  isHuman: any; // TODO refactor | define prop type 123
}

interface StateType
{
  flagHasCustomImage?: any; // TODO refactor | define state type 456
  name?: any; // TODO refactor | define state type 456
  subColor?: any; // TODO refactor | define state type 456
  mainColor?: any; // TODO refactor | define state type 456
}

interface RefTypes extends React.Refs
{
  flagSetter: React.Component<any, any>; // TODO refactor | correct ref type 542 | FlagSetter
}

export class PlayerSetup_COMPONENT_TODO extends React.Component<PropTypes, StateType>
{
  displayName: string = "PlayerSetup";

  state: StateType;
  refsTODO: RefTypes;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
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
  
  private getInitialState(): StateType
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

  handleNameChange(e: Event)
  {
    var target = <HTMLInputElement> e.target;
    this.setState({name: target.value});
  }

  setMainColor(color: number, isNull: boolean)
  {
    this.setState({mainColor: isNull ? null : color});
  }
  setSubColor(color: number, isNull: boolean)
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
      this.refsTODO.flagSetter.state.flag.generateRandom();
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

    var flag = this.refsTODO.flagSetter.state.flag;

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
          ref: "isHuman",
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
          ref: "mainColor",
          onChange: this.setMainColor,
          setActiveColorPicker: this.props.setActiveColorPicker,
          generateColor: this.generateMainColor,
          flagHasCustomImage: this.state.flagHasCustomImage,
          color: this.state.mainColor
        }),
        ColorSetter(
        {
          ref: "subColor",
          onChange: this.setSubColor,
          setActiveColorPicker: this.props.setActiveColorPicker,
          generateColor: this.generateSubColor,
          flagHasCustomImage: this.state.flagHasCustomImage,
          color: this.state.subColor
        }),
        FlagSetter(
        {
          ref: "flagSetter",
          mainColor: this.state.mainColor,
          subColor: this.state.subColor,
          setActiveColorPicker: this.props.setActiveColorPicker,
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

const Factory: React.Factory<PropTypes> = React.createFactory(PlayerSetup_COMPONENT_TODO);
export default Factory;
