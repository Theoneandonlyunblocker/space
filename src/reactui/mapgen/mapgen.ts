module Rance
{
  export module UIComponents
  {
    export var MapGen = React.createClass({

      makeMap: function()
      {
        var mapGen = this.props.mapGen;

        mapGen.makeMap(Rance.Templates.MapGen.defaultMap);

        var doc = mapGen.drawMap();
        this.props.renderer.layers.map.removeChildren();
        this.props.renderer.layers.map.addChild(doc);
      },
      clearMap: function()
      {
        this.props.mapGen.reset();

        var doc = mapGen.drawMap();
        this.props.renderer.layers.map.removeChildren();
        this.props.renderer.layers.map.addChild(doc);
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
            }),
            React.DOM.div(
            {
              className: "map-gen-controls"
            },
              React.DOM.button(
              {
                onClick: this.makeMap
              }, "make"),
              React.DOM.button(
              {
                onClick: this.clearMap
              }, "clear")
            )
            
          )
        );
      },

      componentDidMount: function()
      {
        this.props.renderer.setContainer(this.refs.pixiContainer.getDOMNode());
        this.props.renderer.init();
        this.props.renderer.bindRendererView();
        this.props.renderer.render();
      }
    });
  }
}
