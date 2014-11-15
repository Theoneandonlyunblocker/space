module Rance
{
  export module UIComponents
  {
    export var MapGenControls = React.createClass({

      makeMap: function()
      {
        this.props.mapGen.makeMap(Rance.Templates.MapGen.defaultMap);
        this.props.renderMap();
      },
      clearMap: function()
      {
        this.props.mapGen.reset();
        this.props.renderMap();
      },
    
      render: function()
      {
        return(
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
        );
      }
    });
  }
}
