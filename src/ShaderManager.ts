import NebulaFilter from "./shaders/Nebula.ts";

import Color from "./Color.ts";
import
{
  generateColorScheme
} from "./colorGeneration.ts";
import
{
  randRange
} from "./utility.ts";

export default class ShaderManager
{
  shaders:
  {
    nebula: NebulaFilter;
  };
  constructor()
  {
    this.shaders =
    {
      nebula: this.makeNebulaFilter()
    }
  }
  private makeNebulaFilter(): NebulaFilter
  {
    const nebulaColorScheme = generateColorScheme();
    const lightness = randRange(1.1, 1.3);

    return new NebulaFilter(
    {
      baseColor: {type: "3fv", value: nebulaColorScheme.main.getRGB()},
      overlayColor: {type: "3fv", value: nebulaColorScheme.secondary.getRGB()},
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
    });
  }
}
