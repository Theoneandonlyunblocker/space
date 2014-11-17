/// <reference path="../mapgen/mapgencontrols.ts"/>
/// <reference path="starinfo.ts"/>
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
          React.DOM.div(null,
            React.DOM.div(
            {
              ref: "pixiContainer",
              id: "pixi-container"
            },
              UIComponents.GalaxyMapUI(
              {
                selectedFleets: this.props.playerControl.selectedFleets
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
            ),
            UIComponents.StarInfo()
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
