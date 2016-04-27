/// <reference path="../../lib/pixi.d.ts" />
/// <reference path="../../lib/rng.d.ts" />

import NebulaFilter from "./Nebula";

import {generateColorScheme} from "../../src/colorGeneration";
import
{
  randRange
} from "../../src/utility";

export default function drawNebula(seed: string, size: PIXI.Rectangle, renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer)
{
  var oldRng = Math.random;
  Math.random = RNG.prototype.uniform.bind(new RNG(seed));

  var nebulaColorScheme = generateColorScheme();

  var filter = new NebulaFilter(
  {
    baseColor: nebulaColorScheme.main.getRGB(),
    overlayColor: nebulaColorScheme.secondary.getRGB(),
    highlightColor: [1.0, 1.0, 1.0],

    coverage: randRange(0.28, 0.32),

    scale: randRange(4, 8),

    diffusion: randRange(1.5, 3.0),
    streakiness: randRange(1.5, 2.5),

    streakLightness: randRange(1, 1.2),
    cloudLightness: randRange(1, 1.2),

    highlightA: 0.9,
    highlightB: 2.2,

    seed: [Math.random() * 100, Math.random() * 100]
  });

  var filterContainer = new PIXI.Container();
  filterContainer.filterArea = size;
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
