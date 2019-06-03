import * as PIXI from "pixi.js";
// TODO global ref
// /// <reference path="../../lib/rng.d.ts" />

import BackgroundDrawingFunction from "../../../src/BackgroundDrawingFunction";
import {generateColorScheme} from "../../../src/colorGeneration";
import
{
  generateTextureWithBounds,
  makeShaderSprite,
} from "../../../src/pixiWrapperFunctions";
import
{
  randRange,
} from "../../../src/utility";

import NebulaFilter from "./Nebula";


const drawNebula: BackgroundDrawingFunction = (
  seed: string, size: PIXI.Rectangle, renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer) =>
{
  const oldRng = Math.random;
  Math.random = RNG.prototype.uniform.bind(new RNG(seed));

  const nebulaColorScheme = generateColorScheme();

  const filter = new NebulaFilter(
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

    starDensity: randRange(0.0014, 0.0018),
    nebulaStarConcentration: randRange(0.000, 0.004),
    starBrightness: 0.6,

    seed: [Math.random() * 100, Math.random() * 100],
  });

  const shaderSprite = makeShaderSprite(filter, 0, 0, size.width, size.height);

  // still relevant?
  // TODO performance | need to destroy or reuse texture from filterContainer.generateTexture()
  // creates a new PIXI.FilterManager() every time that doesn't get cleaned up anywhere
  // balloons up gpu memory

  const texture = generateTextureWithBounds(
    renderer,
    shaderSprite,
    PIXI.settings.SCALE_MODE,
    1,
    size,
  );

  const sprite = new PIXI.Sprite(texture);

  shaderSprite.destroy({texture: true, baseTexture: true});

  Math.random = oldRng;

  return(
  {
    displayObject: sprite,
    destroy: texture.destroy.bind(texture),
  });
};

export default drawNebula;
