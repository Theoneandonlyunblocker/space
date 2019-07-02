declare namespace PIXI {
  interface Container {
    destroy(options: boolean |
    {
      children?: boolean;
      texture?: boolean;
      baseTexture?: boolean;
    }): void;
  }
  interface Graphics {
    currentPath: PIXI.Polygon;
  }
  class Filter<U extends object> {
    constructor(vertexSrc?: string, fragmentSrc?: string, uniforms?: Partial<U>);
    uniforms: U;
  }
}
