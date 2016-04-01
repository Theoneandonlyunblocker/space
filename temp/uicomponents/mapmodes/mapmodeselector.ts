/// <reference path="../../maprenderer.ts" />

export var MapModeSelector = React.createFactory(React.createClass(
{
  displayName: "MapModeSelector",

  propTypes:
  {
    mapRenderer: React.PropTypes.instanceOf(Rance.MapRenderer).isRequired,
    onUpdate: React.PropTypes.func
  },

  handleChange: function(e: Event)
  {
    var target = <HTMLInputElement> e.target;
    var value = target.value;
    this.props.mapRenderer.setMapModeByKey(value);

    if (this.props.onUpdate)
    {
      this.props.onUpdate();
    }
  },

  makeOptions: function()
  {
    var mapRenderer: MapRenderer = this.props.mapRenderer;
    var options: ReactDOMPlaceHolder[] = [];

    for (var key in mapRenderer.mapModes)
    {
      var mapMode = mapRenderer.mapModes[key];
      options.push(React.DOM.option(
      {
        value: key,
        key: key
      },
        mapMode.displayName
      ))
    }

    return options;
  },
  

  render: function()
  {
    var mapRenderer: MapRenderer = this.props.mapRenderer;

    return(
      React.DOM.select(
      {
        className: "map-mode-selector",
        value: mapRenderer.currentMapMode.template.key,
        onChange: this.handleChange
      },
        this.makeOptions()
      )
    );
  }
}));
