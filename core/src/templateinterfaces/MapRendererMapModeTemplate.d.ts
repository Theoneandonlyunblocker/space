import {MapRendererLayerTemplate} from "./MapRendererLayerTemplate";


export interface MapRendererMapModeTemplate
{
  key: string;
  displayName: string;
  layers: MapRendererLayerTemplate[];
}
