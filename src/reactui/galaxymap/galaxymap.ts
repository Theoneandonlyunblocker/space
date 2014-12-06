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
      renderMap: function()
      {
        this.props.galaxyMap.mapRenderer.render();
      },
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

        mapRenderer = new MapRenderer();
        mapRenderer.setParent(renderer.layers["map"]);
        this.props.galaxyMap.mapRenderer = mapRenderer;
        mapRenderer.galaxyMap = galaxyMap;
        mapRenderer.player = player1;


        this.props.galaxyMap.mapRenderer.setMapMode("default");
        
        this.props.renderer.render();

        this.renderMap();

        this.props.renderer.camera.centerOnPosition(
          this.props.galaxyMap.mapGen.points[0]);
      }
    });
  }
}
