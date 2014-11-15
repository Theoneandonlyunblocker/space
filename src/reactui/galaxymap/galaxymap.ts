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
        this.props.renderer.init(this.refs.pixiContainer.getDOMNode());
        this.props.renderer.render();

        this.props.galaxyMap.mapRenderer.setMapMode("default");
      }
    });
  }
}
