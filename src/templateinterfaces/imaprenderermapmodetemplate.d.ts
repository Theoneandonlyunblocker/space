/// <reference path="imaprendererlayertemplate.d.ts" />

declare module Rance
{
  export interface IMapRendererMapModeTemplate
  {
    key: string;
    displayName: string;
    layers: IMapRendererLayerTemplate[];
  }
}
