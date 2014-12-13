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
              }),
              UIComponents.PopupManager(
              {
                
              })
            ),
            React.DOM.select(
            {
              className: "reactui-selector",
              ref: "mapModeSelector",
              onChange: this.switchMapMode
            },
              React.DOM.option({value: "default"}, "default"),
              React.DOM.option({value: "noLines"}, "no borders"),
              React.DOM.option({value: "income"}, "income"),
              React.DOM.option({value: "visible"}, "visible")
            )
          )
        );
      },

      
      componentDidMount: function()
      {
        var mapRenderer = this.props.galaxyMap.mapRenderer;

        this.props.renderer.isBattleBackground = false;
        this.props.renderer.bindRendererView(this.refs.pixiContainer.getDOMNode());
        mapRenderer.setAllLayersAsDirty();
        
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
