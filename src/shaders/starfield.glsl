precision mediump float;
uniform vec3 bgColor;
uniform float time;

float density = 0.005;

float rand(vec2 p)
{
  return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x))));
}

void main(void)
{
  vec2 pos = floor(gl_FragCoord.xy);
  float color = 0.0;
  float starGenValue = rand(gl_FragCoord.xy);
  
  if (starGenValue < density)
  {
    float r = rand(gl_FragCoord.xy + vec2(4.20, 6.9));
    color = r * (0.1 * sin(time * (r * 5.0) + 720.0 * r) + 0.75);
    gl_FragColor = vec4(vec3(color), 1.0);
  }
  else
  {
    gl_FragColor = vec4(bgColor, 1.0);
  }
}
