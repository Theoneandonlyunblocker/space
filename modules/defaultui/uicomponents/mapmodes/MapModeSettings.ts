import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../localization/localize";
import {MapRenderer} from "core/maprenderer/MapRenderer";

import {MapModeSelector} from "./MapModeSelector";
import {MapRendererLayersList, MapRendererLayersListComponent} from "./MapRendererLayersList";


export interface PropTypes extends React.Props<any>
{
  mapRenderer: MapRenderer;
}

interface StateType
{
}

export class MapModeSettingsComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "MapModeSettings";

  public state: StateType;
  private readonly layersListComponent = React.createRef<MapRendererLayersListComponent>();

  constructor(props: PropTypes)
  {
    super(props);

    this.bindMethods();
  }
  private bindMethods()
  {
    this.handleReset = this.handleReset.bind(this);
  }

  handleReset()
  {
    const mapRenderer = this.props.mapRenderer;
    mapRenderer.currentMapMode.resetLayers();
    mapRenderer.resetMapModeLayersPosition();
    mapRenderer.setAllLayersAsDirty();
    this.layersListComponent.current.forceUpdate();
  }

  render()
  {
    return(
      ReactDOMElements.div(
      {
        className: "map-mode-settings",
      },
        MapRendererLayersList(
        {
          mapRenderer: this.props.mapRenderer,
          currentMapMode: this.props.mapRenderer.currentMapMode,
          ref: this.layersListComponent,
        }),
        MapModeSelector(
        {
          mapRenderer: this.props.mapRenderer,
          onUpdate: this.forceUpdate.bind(this),
        }),
        ReactDOMElements.button(
        {
          className: "reset-map-mode-button",
          onClick: this.handleReset,
        },
          localize("reset").toString(),
        ),
      )
    );
  }
}

export const MapModeSettings: React.Factory<PropTypes> = React.createFactory(MapModeSettingsComponent);
