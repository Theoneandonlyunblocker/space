/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="maprendererlayerslistitem.ts" />

/// <reference path="../../maprenderer.ts" />

export interface PropTypes
{
  mapRenderer: MapRenderer;
  currentMapMode: MapRendererMapMode;
}

interface StateType
{
  // TODO refactor | add state type
}

class MapRendererLayersList extends React.Component<PropTypes, StateType>
{
  displayName: string = "MapRendererLayersList";
  mixins: reactTypeTODO_any = [React.addons.PureRenderMixin];


  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  private getInitialState(): StateType
  {
    return(
    {
      currentDraggingLayer: null,
      indexToSwapInto: undefined,
      layerKeyToInsertNextTo: null,
      insertPosition: null
    });
  }

  handleDragStart(layer: MapRendererLayer)
  {
    this.setState(
    {
      currentDraggingLayer: layer
    });
  }

  handleDragEnd()
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
  }

  handleToggleActive(layer: MapRendererLayer)
  {
    var mapRenderer: MapRenderer = this.props.mapRenderer;

    mapRenderer.currentMapMode.toggleLayer(layer);
    mapRenderer.updateMapModeLayers([layer]);
    this.forceUpdate();
  }

  handleSetHoverPosition(layer: MapRendererLayer, position: string)
  {
    this.setState(
    {
      layerKeyToInsertNextTo: layer.template.key,
      insertPosition: position
    });
  }

  updateLayer(layer: MapRendererLayer)
  {
    var mapRenderer: MapRenderer = this.props.mapRenderer;
    mapRenderer.setLayerAsDirty(layer.template.key);
  }

  render()
  {
    var mapRenderer: MapRenderer = this.props.mapRenderer;
    var mapMode: MapRendererMapMode = this.props.currentMapMode;
    if (!mapMode) return null;
    var layersData = mapMode.layers;
    var activeLayers = mapMode.getActiveLayers();

    var listItems: ReactDOMPlaceHolder[] = [];

    for (var i = 0; i < layersData.length; i++)
    {
      var layer = layersData[i];
      var layerKey = layer.template.key;

      listItems.push(MapRendererLayersListItem(
      {
        layer: layer,
        layerName: layer.template.displayName,
        isActive: mapMode.activeLayers[layerKey],
        key: layerKey,
        toggleActive: this.handleToggleActive.bind(this, layer),
        listItemIsDragging: Boolean(this.state.currentDraggingLayer),
        onDragStart: this.handleDragStart,
        onDragEnd: this.handleDragEnd,
        setHoverPosition: this.handleSetHoverPosition,
        updateLayer: this.updateLayer,
        containerDragOnly: true,
        containerElement: this
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
}

const Factory: React.Factory<PropTypes> = React.createFactory(MapRendererLayersList);
export default Factory;
