import * as PIXI from "pixi.js";
import * as RNG from "rng-js";

import {BackgroundDrawingFunction} from "../../../src/graphics/BackgroundDrawingFunction";
import {generateColorScheme} from "../../../src/color/colorGeneration";
import
{
  generateTextureWithBounds,
  makeShaderSprite,
} from "../../../src/graphics/pixiWrapperFunctions";
import
{
  randRange,
} from "../../../src/generic/utility";

import {NebulaShader} from "./NebulaShader";


export const drawNebula: BackgroundDrawingFunction = (
  seed: string, size: PIXI.Rectangle, renderer: PIXI.Renderer) =>
{
  const oldRng = Math.random;
  Math.random = RNG.prototype.uniform.bind(new RNG(seed));

  const nebulaColorScheme = generateColorScheme();

  const shader = new NebulaShader(
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

  const shaderSprite = makeShaderSprite(shader, 0, 0, size.width, size.height);

  const texture = generateTextureWithBounds(
    renderer,
    shaderSprite,
    PIXI.settings.SCALE_MODE,
    1,
    size,
  );

  const sprite = new PIXI.Sprite(texture);

  shaderSprite.destroy({children: true});
  Math.random = oldRng;

  return(
  {
    displayObject: sprite,
    destroy: texture.destroy.bind(texture),
  });
};
