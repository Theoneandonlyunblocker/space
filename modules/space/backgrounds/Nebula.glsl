/// tsBuildTargets: shader

precision mediump float;

#define DOMAIN 0 // 0 == pixi, 1 == shdr.bkcore.com

#if DOMAIN == 0
  uniform vec3 baseColor;
  uniform vec3 overlayColor;
  uniform vec3 highlightColor;

  uniform float coverage;

  uniform float scale;

  uniform float diffusion;
  uniform float streakiness;

  uniform float streakLightness;
  uniform float cloudLightness;

  uniform float highlightA;
  uniform float highlightB;

  uniform float starDensity;
  uniform float nebulaStarConcentration;
  uniform float starBrightness;

  uniform vec2 seed;
#elif DOMAIN == 1
  const vec3 baseColor = vec3(1.0, 0.0, 0.0);
  const vec3 overlayColor = vec3(0.0, 0.0, 1.0);
  const vec3 highlightColor = vec3(1.0, 1.0, 1.0);

  const float coverage = 0.3;
  const float coverage2 = coverage / 2.0;

  const float scale = 4.0;

  const float diffusion = 3.0;
  const float streakiness = 2.0;

  const float streakLightness = 1.0;
  const float cloudLightness = 1.0;

  const float highlightA = 0.9;
  const float highlightB = 2.2;

  const float starDensity = 0.0008;
  const float nebulaStarConcentration = 0.01;
  const float starBrightness = 0.6;

  const vec2 seed = vec2(69.0, 42.0);
#endif

const int sharpness = 6;

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
  for (int i = 0; i < sharpness; ++i)
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
  return fbm(pos + vec2(q.x * streakiness, q.y));
}

vec3 colorLayer(vec2 pos, vec3 color)
{
  float v = fbm(pos);
  return mix(vec3(0.0), color, v);
}

vec3 nebula(vec2 pos, out float volume)
{
  vec2 on = vec2(0.0);

  volume = displace(pos, on);
  volume = relativeValue(volume, coverage, streakLightness);
  volume += relativeValue(fbm(pos), coverage, cloudLightness);
  volume = pow(volume, diffusion);

  vec3 c = colorLayer(pos + vec2(42.0, 6.9), baseColor);
  c = mix(c, overlayColor, dot(on.x, on.y));
  c = mix(c, highlightColor, volume *
    smoothstep(highlightA, highlightB, abs(on.x)+abs(on.y)));


  return c * volume;
}

float star(vec2 pos, float volume)
{
  float h = hash(pos);

  float intensityCutoff = (1.0 - starDensity) - (volume * nebulaStarConcentration);
  float starIntensity = smoothstep(intensityCutoff, 1.0, h);

  return starIntensity * starBrightness;
}

void main(void)
{
  vec2 pos = gl_FragCoord.xy / 50.0 / scale;
  pos += seed;
  float volume = 0.0;
  vec3 c = nebula(pos, volume);
  c += vec3(star(pos, volume));

  gl_FragColor = vec4(c, 1.0);
}
