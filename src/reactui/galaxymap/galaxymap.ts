/// <reference path="../popups/popupmanager.ts"/>
/// <reference path="galaxymapui.ts"/>

module Rance
{
  export module UIComponents
  {
    export var GalaxyMap = React.createClass(
    {
      displayName: "GalaxyMap",
      switchMapMode: function()
      {
        var newMode = this.refs.mapModeSelector.getDOMNode().value;

        this.props.galaxyMap.mapRenderer.setMapMode(newMode);
      },
    
      render: function()
      {
        return(
          React.DOM.div(
            {
              className: "galaxy-map"  
            },
            UIComponents.PopupManager(),
            React.DOM.div(
            {
              ref: "pixiContainer",
              id: "pixi-container"
            },
              UIComponents.GalaxyMapUI(
              {
                playerControl: this.props.playerControl,
                player: this.props.player,
                game: this.props.game
              })
            ),
            React.DOM.select(
            {
              className: "reactui-selector",
              ref: "mapModeSelector",
              onChange: this.switchMapMode
            },
              React.DOM.option({value: "default"}, "default"),
              React.DOM.option({value: "noStatic"}, "no static layers"),
              React.DOM.option({value: "income"}, "income"),
              React.DOM.option({value: "influence"}, "influence"),
              React.DOM.option({value: "sectors"}, "sectors"),
              React.DOM.option({value: "regions"}, "regions")
            )
          )
        );
      },

      
      componentDidMount: function()
      {
        this.props.renderer.isBattleBackground = false;
        this.props.renderer.bindRendererView(this.refs.pixiContainer.getDOMNode());
        this.props.galaxyMap.mapRenderer.setMapMode("default");
        
        this.props.renderer.resume();

        this.props.renderer.camera.centerOnPosition(
          this.props.galaxyMap.game.humanPlayer.controlledLocations[0]);
      },
      componentWillUnmount: function()
      {
        this.props.renderer.pause();
        this.props.renderer.removeRendererView();
      }
    });
  }
}
