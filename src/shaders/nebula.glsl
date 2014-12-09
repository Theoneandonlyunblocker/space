// https://www.shadertoy.com/view/4sBXzG



const int NUM_OCTAVES = 6;
float hash(vec2 p)
{
  return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x))));
}

float noise(vec2 x)
{
  vec2 i = floor(x);
  vec2 f = fract(x);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 x)
{
  float v = 0.0;
  float a = 0.5;
  vec2 shift = vec2(100);
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
  for (int i = 0; i < NUM_OCTAVES; ++i)
  {
    v += a * noise(x);
    x = rot * x * 2.0 + shift;
    a *= 0.5;
    }
  return v;
}

float relativeValue(float v, float min, float max)
{
  return (v - min) / (max - min);
}

float displace(vec2 pos, out vec2 q)
{
  q = vec2(fbm(pos),
    fbm(pos + vec2(23.3, 46.7)));
  return fbm(pos + 1.0 * q);
}

vec3 colorLayer(vec2 pos, vec3 color)
{
  float v = fbm(pos);
  return mix(vec3(0.0), color, v);
}

vec3 nebula(vec2 pos)
{
  vec2 on = vec2(0.0);

  float volume = displace(pos, on);
  volume = relativeValue(volume, 0.5, 1.0);
  volume += relativeValue(fbm(pos), 0.3, 1.0);

  vec3 c = colorLayer(pos + vec2(42.0, 6.9), vec3(1.0, 0.0, 0.0));
  c = mix(c, vec3(0.0, 0.0, 1.0), dot(on.x, on.y));

  return c * volume;
}

void main(void)
{
  vec2 pos = gl_FragCoord.xy * 0.01;

  vec3 c = nebula(pos);

  gl_FragColor = vec4(c, 1.0);
}