/// <reference path="../../../lib/react-global.d.ts" />


import {default as MapRendererLayersList, MapRendererLayersListComponent} from "./MapRendererLayersList";
import MapRenderer from "../../MapRenderer";
import MapModeSelector from "./MapModeSelector";


export interface PropTypes extends React.Props<any>
{
  mapRenderer: MapRenderer;
}

interface StateType
{
}

export class MapModeSettingsComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "MapModeSettings";

  state: StateType;
  ref_TODO_layersList: MapRendererLayersListComponent;

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
    var mapRenderer = this.props.mapRenderer;
    mapRenderer.currentMapMode.resetLayers();
    mapRenderer.resetMapModeLayersPosition();
    mapRenderer.setAllLayersAsDirty();
    this.ref_TODO_layersList.forceUpdate();
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
          onUpdate: this.forceUpdate.bind(this)
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
          ref: (component: MapRendererLayersListComponent) =>
          {
            this.ref_TODO_layersList = component;
          }
        })
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(MapModeSettingsComponent);
export default Factory;
