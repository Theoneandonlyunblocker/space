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

        this.props.mapRenderer.setMapMode(newMode);
      },
    
      render: function()
      {
        var mapModeOptions = [];

        for (var mapModeName in this.props.mapRenderer.mapModes)
        {
          mapModeOptions.push(React.DOM.option(
          {
            value: mapModeName,
            key: mapModeName
          },
            this.props.mapRenderer.mapModes[mapModeName].name
          ));
        }

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
              })
            ),
            !Options.debugMode ? null : React.DOM.select(
            {
              className: "reactui-selector debug",
              ref: "mapModeSelector",
              onChange: this.switchMapMode
            },
              mapModeOptions
            )
          )
        );
      },

      
      componentDidMount: function()
      {
        this.props.renderer.isBattleBackground = false;
        this.props.renderer.bindRendererView(this.refs.pixiContainer.getDOMNode());
        this.props.mapRenderer.setMapMode("default");
        
        this.props.renderer.resume();

        // hack. transparency isn't properly rendered without this
        this.props.mapRenderer.setAllLayersAsDirty();

        var centerLocation = this.props.renderer.camera.toCenterOn ||
          this.props.toCenterOn ||
          this.props.player.controlledLocations[0];

        this.props.renderer.camera.centerOnPosition(centerLocation);
      },
      componentWillUnmount: function()
      {
        this.props.renderer.pause();
        this.props.renderer.removeRendererView();
      }
    });
  }
}
