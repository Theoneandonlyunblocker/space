import * as React from "react";

import MapRenderer from "../../MapRenderer";
import MapRendererLayer from "../../MapRendererLayer";
import MapRendererMapMode from "../../MapRendererMapMode";

import MapRendererLayersListItem from "./MapRendererLayersListItem";


export interface PropTypes extends React.Props<any>
{
  mapRenderer: MapRenderer;
  currentMapMode: MapRendererMapMode;
}

interface StateType
{
  layerToInsertNextTo?: MapRendererLayer | null;
  insertPosition?: "top" | "bottom" | null;
  currentDraggingLayer?: MapRendererLayer | null;
}

export class MapRendererLayersListComponent extends React.PureComponent<PropTypes, StateType>
{
  public displayName: string = "MapRendererLayersList";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.state =
    {
      currentDraggingLayer: null,
      layerToInsertNextTo: null,
      insertPosition: null,
    };

    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleToggleActive = this.handleToggleActive.bind(this);
    this.updateLayer = this.updateLayer.bind(this);
    this.handleSetHoverPosition = this.handleSetHoverPosition.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
  }

  public handleDragStart(layer: MapRendererLayer): void
  {
    this.setState(
    {
      currentDraggingLayer: layer,
    });
  }
  public handleDragEnd(): void
  {
    this.props.mapRenderer.currentMapMode.moveLayer(
      this.state.currentDraggingLayer,
      this.state.layerToInsertNextTo,
      this.state.insertPosition,
    );

    this.props.mapRenderer.resetMapModeLayersPosition();

    this.setState(
    {
      currentDraggingLayer: null,
      layerToInsertNextTo: null,
      insertPosition: null,
    });
  }
  public render(): React.ReactHTMLElement<HTMLOListElement> | null
  {
    const mapMode = this.props.currentMapMode;
    if (!mapMode)
    {
      return null;
    }
    const layersData = mapMode.layers;

    const listItems: React.ReactElement<any>[] = [];

    for (let i = 0; i < layersData.length; i++)
    {
      const layer = layersData[i];
      const layerKey = layer.template.key;

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
        hoverSide: (layer === this.state.layerToInsertNextTo ? this.state.insertPosition : null),
        updateLayer: this.updateLayer,
        dragPositionerProps:
        {
          containerElement: this,
          startOnHandleElementOnly: true,
        },
      }));
    }

    return(
      React.DOM.ol(
      {
        className: "map-renderer-layers-list",
      },
        listItems,
      )
    );
  }
  private handleToggleActive(layer: MapRendererLayer): void
  {
    const mapRenderer = this.props.mapRenderer;

    mapRenderer.currentMapMode.toggleLayer(layer);
    mapRenderer.updateMapModeLayers([layer]);
    this.forceUpdate();
  }
  private handleSetHoverPosition(layer: MapRendererLayer, position: "top" | "bottom"): void
  {
    this.setState(
    {
      layerToInsertNextTo: layer,
      insertPosition: position,
    });
  }
  private updateLayer(layer: MapRendererLayer): void
  {
    const mapRenderer = this.props.mapRenderer;
    mapRenderer.setLayerAsDirty(layer.template.key);
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(MapRendererLayersListComponent);
export default Factory;
