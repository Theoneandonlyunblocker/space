namespace Rance
{
  export namespace Modules
  {
    export namespace DefaultModule
    {
      export function drawNebula(seed: string, renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer)
      {
        var oldRng = Math.random;
        Math.random = RNG.prototype.uniform.bind(new RNG(seed));

        var nebulaColorScheme = generateColorScheme();

        var lightness = randRange(1, 1.2);

        var uniforms =
        {
          baseColor: {type: "3fv", value: hex2rgb(nebulaColorScheme.main)},
          overlayColor: {type: "3fv", value: hex2rgb(nebulaColorScheme.secondary)},
          highlightColor: {type: "3fv", value: [1.0, 1.0, 1.0]},

          coverage: {type: "1f", value: randRange(0.28, 0.32)},

          scale: {type: "1f", value: randRange(4, 8)},

          diffusion: {type: "1f", value: randRange(1.5, 3.0)},
          streakiness: {type: "1f", value: randRange(1.5, 2.5)},

          streakLightness: {type: "1f", value: lightness},
          cloudLightness: {type: "1f", value: lightness},

          highlightA: {type: "1f", value: 0.9},
          highlightB: {type: "1f", value: 2.2},

          seed: {type: "2fv", value: [Math.random() * 100, Math.random() * 100]}
        };

        var filter = new NebulaFilter(uniforms);

        var filterContainer = new PIXI.Container();
        filterContainer.filterArea = new PIXI.Rectangle(0, 0, renderer.width, renderer.height);
        filterContainer.filters = [filter];

        // TODO performance | need to destroy or reuse texture from filterContainer.generateTexture()
        // creates a new PIXI.FilterManager() every time that doesn't get cleaned up anywhere
        // balloons up gpu memory
        var texture = filterContainer.generateTexture(
          renderer, PIXI.SCALE_MODES.DEFAULT, 1, filterContainer.filterArea);

        var sprite = new PIXI.Sprite(texture);

        filterContainer.filters = null;
        filterContainer = null;

        return sprite;
      }
    }
  }
}
