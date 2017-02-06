// Autogenerated from "./BlackToAlpha.glsl"

/// <reference path="../../../../lib/pixi.d.ts"/>

interface Uniforms
{
}

interface PartialUniformValues
{
}

export default class BlackToAlpha extends PIXI.Filter
{
  public uniforms: Uniforms; // needs to be public for PIXI, but shouldnt be accessed

  constructor(initialUniformValues?: PartialUniformValues)
  {
    const uniforms = BlackToAlpha.makeUniformsObject(initialUniformValues);
    super(null, sourceLines.join("\n"), uniforms);
  }
  private static makeUniformsObject(initialValues: PartialUniformValues = {}): Uniforms
  {
    return(
    {
    });
  }
  public setUniformValues(values: PartialUniformValues)
  {
    for (let key in values)
    {
      this.uniforms[key] = values[key];
    }
  }
}

const sourceLines =
[
  "precision mediump float;",
  "",
  "varying vec2 vTextureCoord;",
  "uniform sampler2D uSampler;",
  "",
  "void main()",
  "{",
  "  vec4 color = texture2D(uSampler, vTextureCoord);",
  "  color.a = (color.r + color.g + color.b) / 3.0;",
  "",
  "  gl_FragColor = color;",
  "}",
];
