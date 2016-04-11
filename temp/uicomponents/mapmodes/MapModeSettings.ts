/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="mapmodeselector.ts" />
/// <reference path="maprendererlayerslist.ts" />

/// <reference path="../../maprenderer.ts" />


import MapRendererLayersList from "./MapRendererLayersList.ts";
import MapRenderer from "../../../src/MapRenderer.ts";
import MapModeSelector from "./MapModeSelector.ts";


export interface PropTypes extends React.Props<any>
{
  mapRenderer: MapRenderer;
}

interface StateType
{
}

interface RefTypes extends React.Refs
{
  layersList: React.Component<any, any>; // MapRendererLayersList
}

class MapModeSettings_COMPONENT_TODO extends React.Component<PropTypes, StateType>
{
  displayName: string = "MapModeSettings";


  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  handleReset()
  {
    var mapRenderer: MapRenderer = this.props.mapRenderer;
    mapRenderer.currentMapMode.resetLayers();
    mapRenderer.resetMapModeLayersPosition();
    mapRenderer.setAllLayersAsDirty();
    this.refs.layersList.forceUpdate();
  }

  render()
  {
    return(
      React.DOM.div(
      {
        className: "map-mode-settings"
      },
        MapModeSelector(
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
        MapRendererLayersList(
        {
          mapRenderer: this.props.mapRenderer,
          currentMapMode: this.props.mapRenderer.currentMapMode,
          ref: "layersList"
        })
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(MapModeSettings_COMPONENT_TODO);
export default Factory;
