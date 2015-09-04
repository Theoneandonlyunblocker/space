/// <reference path="colorsetter.ts" />
/// <reference path="flagsetter.ts" />

module Rance
{
  export module UIComponents
  {
    export var PlayerSetup = React.createClass(
    {
      displayName: "PlayerSetup",

      getInitialState: function()
      {
        return(
        {
          name: this.props.initialName,
          mainColor: null,
          subColor: null,
          flagHasCustomImage: false
        });
      },
      generateMainColor: function(subColor = this.state.subColor)
      {
        if (subColor === null)
        {
          return generateMainColor();
        }
        else
        {
          return generateSecondaryColor(subColor);
        }
      },
      generateSubColor: function(mainColor = this.state.mainColor)
      {
        if (mainColor === null)
        {
          return generateMainColor();
        }
        else
        {
          return generateSecondaryColor(mainColor);
        }
      },
      handleSetHuman: function()
      {
        this.props.setHuman(this.props.key);
      },

      handleNameChange: function(e: Event)
      {
        var target = <HTMLInputElement> e.target;
        this.setState({name: target.value});
      },

      setMainColor: function(color: number, isNull: boolean)
      {
        this.setState({mainColor: isNull ? null : color});
      },
      setSubColor: function(color: number, isNull: boolean)
      {
        this.setState({subColor: isNull ? null : color});
      },
      handleRemove: function()
      {
        this.props.removePlayers([this.props.key]);
      },
      handleSetCustomImage: function(image?: string)
      {
        this.setState({flagHasCustomImage: Boolean(image)});
      },
      randomize: function()
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
      },
      makePlayer: function()
      {
        var player = new Player(!this.props.isHuman);

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

        player.setIcon();

        this.setState(
        {
          mainColor: player.color,
          subColor: player.secondaryColor
        });

        return player;
      },
      render: function()
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
    })
  }
}
