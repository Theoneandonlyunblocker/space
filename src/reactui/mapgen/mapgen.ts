module Rance
{
  export module UIComponents
  {
    export var MapGen = React.createClass({

      generateMap: function(e)
      {
        if (e.button !== 0) return;
        
        this.props.mapGen.generatePoints(30);
        this.props.mapGen.triangulate();

        var doc = this.props.mapGen.drawMap();

        doc.height;

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
