/// <reference path="imaprendererlayertemplate.d.ts" />

declare namespace Rance
{
  export interface IMapRendererMapModeTemplate
  {
    key: string;
    displayName: string;
    layers: IMapRendererLayerTemplate[];
  }
}
