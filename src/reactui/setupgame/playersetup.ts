/// <reference path="colorsetter.ts" />

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
          mainColor: 0x000000,
          subColor: 0xFFFFFF,
          flagEmblem: null
        });
      },
      setMainColor: function(color: number)
      {
        this.setState({mainColor: color});
      },
      setSubColor: function(color: number)
      {
        this.setState({subColor: color});
      },
      handleRemove: function()
      {
        this.props.removePlayer(this.key)
      },
      render: function()
      {
        return(
          React.DOM.div({className: "player-setup"},
            React.DOM.div({className: "player-setup-name"}, "playerName"),
            UIComponents.ColorSetter({ref: "mainColor", onChange: this.setMainColor}),
            UIComponents.ColorSetter({ref: "subColor", onChange: this.setSubColor}),
            UIComponents.FlagSetter(
            {
              mainColor: this.state.mainColor,
              subColor: this.state.mainColor,
              flagEmblem: this.state.flagEmblem
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
