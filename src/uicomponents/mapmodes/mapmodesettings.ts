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
        this.props.mapRenderer.currentMapMode.resetLayers();
        this.props.mapRenderer.setAllLayersAsDirty();
        this.forceUpdate();
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
              onUpdate: this.forceUpdate.bind(this)
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
              currentMapMode: this.props.mapRenderer.currentMapMode
            })
          )
        );
      }
    })
  }
}
