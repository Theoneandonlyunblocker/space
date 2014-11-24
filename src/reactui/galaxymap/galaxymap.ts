/// <reference path="../mapgen/mapgencontrols.ts"/>
/// <reference path="galaxymapui.ts"/>

module Rance
{
  export module UIComponents
  {
    export var GalaxyMap = React.createClass({

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
                playerControl: this.props.playerControl
              })
            ),
            UIComponents.MapGenControls(
            {
              mapGen: this.props.galaxyMap.mapGen,
              renderMap: this.renderMap
            }),
            React.DOM.select(
            {
              className: "reactui-selector",
              ref: "mapModeSelector",
              onChange: this.switchMapMode
            },
              React.DOM.option({value: "default"}, "default"),
              React.DOM.option({value: "noLines"}, "no borders")
            )
          )
        );
      },

      componentDidMount: function()
      {
        if (mapRenderer) mapRenderer.resetContainer();

        this.props.renderer.setContainer(this.refs.pixiContainer.getDOMNode());
        this.props.renderer.init();
        this.props.renderer.bindRendererView();

        mapRenderer = new MapRenderer();
        mapRenderer.setParent(renderer.layers["map"]);
        this.props.galaxyMap.mapRenderer = mapRenderer;
        mapRenderer.galaxyMap = galaxyMap;


        this.props.galaxyMap.mapRenderer.setMapMode("default");
        
        this.props.renderer.render();

        if (!this.props.galaxyMap.mapGen.points[0])
        {
          this.props.galaxyMap.mapGen.makeMap(Rance.Templates.MapGen.defaultMap);
        }
        this.renderMap();

        this.props.renderer.camera.centerOnPosition(
          this.props.galaxyMap.mapGen.points[0]);
      }
    });
  }
}
