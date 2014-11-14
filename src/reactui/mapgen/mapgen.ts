module Rance
{
  export module UIComponents
  {
    export var MapGen = React.createClass({

      generateMap: function(e)
      {
        if (e.button !== 0) return;
        
        var mapGen = this.props.mapGen;

        if (mapGen.points && mapGen.points.length <= 0)
        {
          mapGen.generatePoints(60);
        }
        else if (!mapGen.triangles || !mapGen.triangles.length)
        {
          mapGen.triangulate();
          mapGen.makeVoronoi();
        }
        else
        {
          mapGen.relaxAndRecalculate();
        }

        var doc = mapGen.drawMap();
        this.props.renderer.layers.main.removeChildren();
        this.props.renderer.layers.main.addChild(doc);
      },
      clearMap: function()
      {
        this.props.mapGen.reset();

        var doc = mapGen.drawMap();
        this.props.renderer.layers.main.removeChildren();
        this.props.renderer.layers.main.addChild(doc);
      },
      severFiller: function(e)
      {
        var mapGen = this.props.mapGen;

        mapGen.severArmLinks()
        var doc = mapGen.drawMap();
        this.props.renderer.layers.main.removeChildren();
        this.props.renderer.layers.main.addChild(doc);
      },
    
      render: function()
      {
        return(
          React.DOM.div(null,
            React.DOM.div(
            {
              ref: "pixiContainer",
              id: "pixi-container",
              onClick: this.generateMap
            }),
            React.DOM.div(
            {
              className: "map-gen-controls"
            },
              React.DOM.button(
              {
                onClick: this.clearMap
              }, "clear"),
              React.DOM.button(
              {
                onClick: this.severFiller
              }, "sever")
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
