precision mediump float;
uniform vec3 bgColor;
uniform float time;

float density = 0.005;
float inverseDensity = 1.0 - density;
float rand(vec2 co)
{
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}
void main(void)
{
  vec2 pos = floor(gl_FragCoord.xy);
  float color = 0.0;
  float starGenValue = rand(gl_FragCoord.xy);

  if (starGenValue > inverseDensity)
  {
    float r = rand(gl_FragCoord.xy + vec2(4.20, 6.9));
    color = r * (0.25 * sin(time * (r * 5.0) + 720.0 * r) + 0.75);
    gl_FragColor = vec4(vec3(color), 1.0);
  }
  else
  {
    gl_FragColor = vec4(bgColor, 1.0);
  }
}