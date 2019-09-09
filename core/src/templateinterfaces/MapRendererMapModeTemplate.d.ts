import {MapRendererLayerTemplate} from "./MapRendererLayerTemplate";


export interface MapRendererMapModeTemplate
{
  key: string;
  displayName: string;
  // TODO 2019.08.21 | allow setting alpha per layer
  layers: MapRendererLayerTemplate[];
}
