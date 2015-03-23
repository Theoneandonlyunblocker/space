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
          mainColor: 0xFFFFFF,
          mainColorIsNull: true,
          subColor: 0xFFFFFF,
          subColorIsNull: true,
          flagEmblem: null
        });
      },
      generateMainColor: function()
      {
        if (this.state.subColorIsNull)
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
        if (this.state.mainColorIsNull)
        {
          return generateMainColor();
        }
        else
        {
          return generateSecondaryColor(this.state.mainColor);
        }
      },

      setMainColor: function(color: number, isNull: boolean)
      {
        this.setState({mainColor: color, mainColorIsNull: isNull});
      },
      setSubColor: function(color: number, isNull: boolean)
      {
        this.setState({subColor: color, subColorIsNull: isNull});
      },
      handleRemove: function()
      {
        this.props.removePlayer(this.props.key)
      },
      render: function()
      {
        return(
          React.DOM.div({className: "player-setup"},
            React.DOM.div({className: "player-setup-name"}, "playerName"),
            UIComponents.ColorSetter(
            {
              ref: "mainColor",
              onChange: this.setMainColor,
              setActiveColorPicker: this.props.setActiveColorPicker,
              generateColor: this.generateMainColor
            }),
            UIComponents.ColorSetter(
            {
              ref: "subColor",
              onChange: this.setSubColor,
              setActiveColorPicker: this.props.setActiveColorPicker,
              generateColor: this.generateSubColor
            }),
            UIComponents.FlagSetter(
            {
              mainColor: this.state.mainColor,
              subColor: this.state.mainColor,
              flagEmblem: this.state.flagEmblem,
              setActiveColorPicker: this.props.setActiveColorPicker
            }),
            React.DOM.div(
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
