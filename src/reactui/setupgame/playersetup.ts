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
      generateMainColor: function()
      {
        if (this.state.subColor === null)
        {
          return generateMainColor();
        }
        else
        {
          return generateSecondaryColor(this.state.subColor);
        }
      },
      generateSubColor: function()
      {
        if (this.state.mainColor === null)
        {
          return generateMainColor();
        }
        else
        {
          return generateSecondaryColor(this.state.mainColor);
        }
      },
      handleSetHuman: function(e)
      {
        this.props.setHuman(this.props.key);
      },

      handleNameChange: function(e)
      {
        this.setState({name: e.target.value});
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
        this.props.removePlayer(this.props.key)
      },
      handleSetCustomImage: function(image?)
      {
        this.setState({flagHasCustomImage: Boolean(image)});
      },
      makePlayer: function()
      {
        //var player =
      },
      render: function()
      {
        return(
          React.DOM.div({className: "player-setup"},
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
              flagHasCustomImage: this.state.flagHasCustomImage
            }),
            UIComponents.ColorSetter(
            {
              ref: "subColor",
              onChange: this.setSubColor,
              setActiveColorPicker: this.props.setActiveColorPicker,
              generateColor: this.generateSubColor,
              flagHasCustomImage: this.state.flagHasCustomImage
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
