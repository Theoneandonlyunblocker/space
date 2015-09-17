/// <reference path="imaprendererlayertemplate.d.ts" />

declare module Rance
{
  export interface IMapRendererMapModeTemplate
  {
    key: string;
    displayName: string;
    // array of objects because we might want to attach additional properties
    // per layer like alpha etc.
    layers:
    {
      layer: IMapRendererLayerTemplate;
    }[];
  }
}
