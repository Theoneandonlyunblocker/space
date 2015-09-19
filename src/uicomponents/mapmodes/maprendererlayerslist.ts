/// <reference path="maprendererlayerslistitem.ts" />

module Rance
{
  export module UIComponents
  {
    export var MapRendererLayersList = React.createClass(
    {
      displayName: "MapRendererLayersList",

      getInitialState: function()
      {
        return(
        {
          currentDraggingLayer: null,
          indexToSwapInto: undefined,
          layerKeyToInsertNextTo: null,
          insertPosition: null
        });
      },

      handleDragStart: function(layer: MapRendererLayer)
      {
        this.setState(
        {
          currentDraggingLayer: layer
        });
      },

      handleDragEnd: function()
      {
        var mapRenderer: MapRenderer = this.props.mapRenderer;
        var toInsert = this.state.currentDraggingLayer;
        var insertTarget = mapRenderer.layers[this.state.layerKeyToInsertNextTo];
        mapRenderer.currentMapMode.insertLayerNextToLayer(
          toInsert,
          insertTarget,
          this.state.insertPosition
        );

        mapRenderer.resetMapModeLayersPosition();

        this.setState(
        {
          currentDraggingLayer: null,
          indexToSwapInto: undefined,
          layerKeyToInsertNextTo: null,
          insertPosition: null
        });
      },

      handleToggleActive: function(layer: MapRendererLayer)
      {
        var mapRenderer: MapRenderer = this.props.mapRenderer;

        mapRenderer.currentMapMode.toggleLayer(layer);
        mapRenderer.updateMapModeLayers([layer]);
        this.forceUpdate();
      },

      handleSetHoverPosition: function(layer: MapRendererLayer, position: string)
      {
        this.setState(
        {
          layerKeyToInsertNextTo: layer.template.key,
          insertPosition: position
        });
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
            layer: layer,
            layerName: layer.template.displayName,
            isActive: mapMode.activeLayers[layerKey],
            key: layerKey,
            toggleActive: this.handleToggleActive.bind(this, layer),
            listItemIsDragging: Boolean(this.state.currentDraggingLayer),
            onDragStart: this.handleDragStart,
            onDragEnd: this.handleDragEnd,
            setHoverPosition: this.handleSetHoverPosition
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
