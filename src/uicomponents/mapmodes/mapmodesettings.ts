/// <reference path="mapmodeselector.ts" />
/// <reference path="maprendererlayerslist.ts" />

/// <reference path="../../maprenderer.ts" />

module Rance
{
  export module UIComponents
  {
    export var MapModeSettings = React.createClass(
    {
      displayName: "MapModeSettings",

      propTypes:
      {
        mapRenderer: React.PropTypes.instanceOf(Rance.MapRenderer).isRequired
      },

      handleReset: function()
      {
        var mapRenderer: MapRenderer = this.props.mapRenderer;
        mapRenderer.currentMapMode.resetLayers();
        mapRenderer.resetMapModeLayersPosition();
        mapRenderer.setAllLayersAsDirty();
        this.refs.layersList.forceUpdate();
      },

      render: function()
      {
        return(
          React.DOM.div(
          {
            className: "map-mode-settings"
          },
            UIComponents.MapModeSelector(
            {
              mapRenderer: this.props.mapRenderer,
              onUpdate: this.forceUpdate.bind(this),
              ref: "selector"
            }),
            React.DOM.button(
            {
              className: "reset-map-mode-button",
              onClick: this.handleReset
            },
              "Reset"
            ),
            UIComponents.MapRendererLayersList(
            {
              mapRenderer: this.props.mapRenderer,
              currentMapMode: this.props.mapRenderer.currentMapMode,
              ref: "layersList"
            })
          )
        );
      }
    })
  }
}
