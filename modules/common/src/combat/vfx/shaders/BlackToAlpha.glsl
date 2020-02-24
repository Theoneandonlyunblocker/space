/// tsBuildTargets: filter

precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

void main()
{
  vec4 color = texture2D(uSampler, vTextureCoord);
  color.a = (color.r + color.g + color.b) / 3.0;

  gl_FragColor = color;
}
