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
          mapGen.generatePoints(40);
          mapGen.triangulate();
          mapGen.makeVoronoi();
        }
        else
        {
          mapGen.relaxAndRecalculate();
        }

        var doc = mapGen.drawMap();

        var ababab = doc.height;

        this.props.renderer.layers.main.removeChildren();
        this.props.renderer.layers.main.addChild(doc);
      },
    
      render: function()
      {
        return(
          React.DOM.div(
          {
            id: "pixi-container",
            onClick: this.generateMap
          })
        );
      },

      componentDidMount: function()
      {
        this.props.renderer.setContainer(this.getDOMNode());
        this.props.renderer.init();
        this.props.renderer.bindRendererView();
        this.props.renderer.render();
      }
    });
  }
}
