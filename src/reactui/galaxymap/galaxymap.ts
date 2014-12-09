/// <reference path="../mapgen/mapgencontrols.ts"/>
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
                player: this.props.player
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
        if (mapRenderer) mapRenderer.resetContainer();

        if (!this.props.galaxyMap.mapGen.points[0])
        {
          this.props.galaxyMap.mapGen.makeMap(Rance.Templates.MapGen.defaultMap);
        }
        
        this.props.renderer.setContainer(this.refs.pixiContainer.getDOMNode());
        this.props.renderer.init();
        this.props.renderer.bindRendererView();

        if (!mapRenderer) mapRenderer = new MapRenderer();

        mapRenderer.init();
        mapRenderer.setParent(renderer.layers["map"]);
        this.props.galaxyMap.mapRenderer = mapRenderer;
        mapRenderer.galaxyMap = galaxyMap;
        mapRenderer.player = player1;
        mapRenderer.makeFowSprite();

        this.props.galaxyMap.mapRenderer.currentMapMode = null;
        this.props.galaxyMap.mapRenderer.setMapMode("default");
        this.props.galaxyMap.mapRenderer.setAllLayersAsDirty();
        
        this.props.renderer.resume();
        //this.props.renderer.render();


        this.props.renderer.camera.centerOnPosition(
          player1.controlledLocations[0]);
      }
    });
  }
}
