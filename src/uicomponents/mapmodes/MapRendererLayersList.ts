/// <reference path="../../../lib/react-global-0.13.3.d.ts" />

import MapRendererMapMode from "../../MapRendererMapMode";
import MapRendererLayer from "../../MapRendererLayer";
import MapRendererLayersListItem from "./MapRendererLayersListItem";
import MapRenderer from "../../MapRenderer";


interface PropTypes extends React.Props<any>
{
  mapRenderer: MapRenderer;
  currentMapMode: MapRendererMapMode;
}

interface StateType
{
  layerKeyToInsertNextTo?: string;
  insertPosition?: string;
  currentDraggingLayer?: MapRendererLayer;
}

export class MapRendererLayersListComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "MapRendererLayersList";
  shouldComponentUpdate = React.addons.PureRenderMixin.shouldComponentUpdate.bind(this);


  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleToggleActive = this.handleToggleActive.bind(this);
    this.updateLayer = this.updateLayer.bind(this);
    this.handleSetHoverPosition = this.handleSetHoverPosition.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);    
  }
  
  private getInitialState(): StateType
  {
    return(
    {
      currentDraggingLayer: null,
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
    var mapRenderer = this.props.mapRenderer;
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
      layerKeyToInsertNextTo: null,
      insertPosition: null
    });
  }

  handleToggleActive(layer: MapRendererLayer)
  {
    var mapRenderer = this.props.mapRenderer;

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
    var mapRenderer = this.props.mapRenderer;
    mapRenderer.setLayerAsDirty(layer.template.key);
  }

  render()
  {
    var mapRenderer = this.props.mapRenderer;
    var mapMode = this.props.currentMapMode;
    if (!mapMode) return null;
    var layersData = mapMode.layers;
    var activeLayers = mapMode.getActiveLayers();

    var listItems: React.ReactElement<any>[] = [];

    for (let i = 0; i < layersData.length; i++)
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
        dragPositionerProps:
        {
          containerElement: this,
          containerDragOnly: true,
        }
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

const Factory: React.Factory<PropTypes> = React.createFactory(MapRendererLayersListComponent);
export default Factory;
