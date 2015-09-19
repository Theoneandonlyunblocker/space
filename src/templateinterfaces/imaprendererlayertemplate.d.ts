declare module Rance
{
  interface IMapRendererLayerTemplate
    {
      key: string;
      displayName: string;
      drawingFunction: (map: GalaxyMap) => PIXI.Container;
      interactive: boolean;
      alpha?: number; // default 1.0
    }
}
