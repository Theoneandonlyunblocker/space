/// <reference path="../mapgen/mapgencontrols.ts"/>

module Rance
{
  export module UIComponents
  {
    export var GalaxyMap = React.createClass({

      renderMap: function()
      {
        this.props.galaxyMap.mapRenderer.render();
      },
      switchMapMode: function(newMode: string)
      {
        this.props.galaxyMap.mapRenderer.switchMapMode(newMode);
      },
    
      render: function()
      {
        return(
          React.DOM.div(null,
            React.DOM.div(
            {
              ref: "pixiContainer",
              id: "pixi-container"
            }),
            UIComponents.MapGenControls(
            {
              mapGen: this.props.galaxyMap.mapGen,
              renderMap: this.renderMap
            })
          )
        );
      },

      componentDidMount: function()
      {
        this.props.renderer.setContainer(this.refs.pixiContainer.getDOMNode());
        this.props.renderer.init();
        this.props.renderer.bindRendererView();

        var mapRenderer = new MapRenderer();
        mapRenderer.setParent(renderer.layers["map"]);
        this.props.galaxyMap.mapRenderer = mapRenderer;
        mapRenderer.galaxyMap = galaxyMap;

        this.props.galaxyMap.mapRenderer.setMapMode("default");
        
        this.props.renderer.render();
      }
    });
  }
}
