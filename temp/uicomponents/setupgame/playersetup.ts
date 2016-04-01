/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="colorsetter.ts" />
/// <reference path="flagsetter.ts" />

export interface PropTypes
{
  // TODO refactor | add prop types
}

export default class PlayerSetup extends React.Component<PropTypes, {}>
{
  displayName: string = "PlayerSetup";

  state:
  {
    
  }

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  getInitialState()
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
      this.refs.flagSetter.state.flag.generateRandom();
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

    var flag = this.refs.flagSetter.state.flag;

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
        UIComponents.ColorSetter(
        {
          ref: "mainColor",
          onChange: this.setMainColor,
          setActiveColorPicker: this.props.setActiveColorPicker,
          generateColor: this.generateMainColor,
          flagHasCustomImage: this.state.flagHasCustomImage,
          color: this.state.mainColor
        }),
        UIComponents.ColorSetter(
        {
          ref: "subColor",
          onChange: this.setSubColor,
          setActiveColorPicker: this.props.setActiveColorPicker,
          generateColor: this.generateSubColor,
          flagHasCustomImage: this.state.flagHasCustomImage,
          color: this.state.subColor
        }),
        UIComponents.FlagSetter(
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
