/// <reference path="uniformmanager.ts"/>
/// <reference path="shaders/converted/shadersources.ts"/>

module Rance
{
  export class NebulaFilter extends PIXI.AbstractFilter
  {
    constructor(uniforms: any)
    {
      super(null, ShaderSources.nebula.join("\n"), uniforms);
    }
  }
  export class OccupationFilter extends PIXI.AbstractFilter
  {
    constructor(uniforms: any)
    {
      super(null, ShaderSources.occupation.join("\n"), uniforms);
    }
  }
  export class GuardFilter extends PIXI.AbstractFilter
  {
    constructor(uniforms: any)
    {
      super(null, ShaderSources.guard.join("\n"), uniforms);
    }
  }
  export class ShaderManager
  {
    shaders:
    {
      [name: string]: PIXI.AbstractFilter;
    } = {};
    uniformManager: UniformManager;
    constructor()
    {
      this.uniformManager = new UniformManager();
      this.initNebula();
    }
    initNebula()
    {
      var nebulaColorScheme = generateColorScheme();

      var lightness = randRange(1.1, 1.3);

      var nebulaUniforms =
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
      }



      this.shaders["nebula"] = new NebulaFilter(nebulaUniforms);
    }
  }
}