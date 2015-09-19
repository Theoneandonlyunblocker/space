/// <reference path="maprendererlayerslistitem.ts" />

module Rance
{
  export module UIComponents
  {
    export var MapRendererLayersList = React.createClass(
    {
      displayName: "MapRendererLayersList",

      handleToggleActive: function(layer: MapRendererLayer)
      {
        var mapRenderer: MapRenderer = this.props.mapRenderer;

        mapRenderer.currentMapMode.toggleLayer(layer);
        mapRenderer.updateMapModeLayers([layer]);
        this.forceUpdate();
      },

      render: function()
      {
        var mapRenderer: MapRenderer = this.props.mapRenderer;
        var mapMode = mapRenderer.currentMapMode;
        if (!mapMode) return null;
        var layersData = mapMode.layers;
        var activeLayers = mapMode.getActiveLayers();

        var listItems: ReactDOMPlaceHolder[] = [];

        for (var i = 0; i < layersData.length; i++)
        {
          var layer = layersData[i].layer;
          var layerKey = layer.template.key;

          listItems.push(UIComponents.MapRendererLayersListItem(
          {
            layerName: layer.template.displayName,
            isActive: mapMode.activeLayers[layerKey],
            key: layerKey,
            toggleActive: this.handleToggleActive.bind(this, layer)
          }));
        }
        
        return(
          React.DOM.ol(
          {
            className: "map-renderer-layers-list"
          },
            listItems
          )
        );
      }
    })
  }
}
