precision mediump float;

#define DOMAIN 0 // 0 == pixi, 1 == shdr.bkcore.com

#if DOMAIN == 0
  varying vec2 vTextureCoord;
  uniform sampler2D uSampler;

  uniform float time;
  uniform float seed;
  uniform float noiseAmplitude;

  uniform float aspectRatio;

  uniform vec4 beamColor;
  uniform float beamYPosition;

  uniform float lineIntensity;
  uniform float bulgeIntensity;

  uniform float bulgeXPosition;
  uniform vec2 bulgeSize;
  uniform float bulgeSharpness;

  uniform vec2 lineXSize;
  uniform float lineXSharpness;

  uniform float lineYSize;
  uniform float lineYSharpness;


#elif DOMAIN == 1
  uniform vec2 resolution;
  uniform float time;

  const float seed = 420.69;
  const float noiseAmplitude = 0.5;
  float aspectRatio = resolution.x / resolution.y;

  const vec4 beamColor = vec4(1.0, 0.5, 0.5, 1.0);
  const float beamYPosition = 0.5;

  const float bulgeXPosition = 0.4;
  const vec2 bulgeSize = vec2(0.8, 0.4);
  const float bulgeSharpness = 0.4;
  const float bulgeIntensity = 3.0;

  const vec2 lineXSize = vec2(0.4, 1.0);
  const float lineXSharpness = 0.3;

  const float lineYSize = 0.02;
  const float lineYSharpness = 0.8;
  const float lineIntensity = 5.0;


#endif

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

float ellipseGradient(vec2 p, float ellipseXPosition, vec2 ellipseSize)
{
  vec2 q = vec2(-1.0 + 2.0 * p.x, p.y); // (-1, -1) -> (1, 1)
  q.x -= -1.0 + 2.0 * ellipseXPosition;
  q.x *= aspectRatio;
  q /= ellipseSize;

  float dist = length(q);

  return dist;
}

void main()
{
  #if DOMAIN == 0
    vec2 uv = vTextureCoord;
    vec4 color = texture2D(uSampler, vTextureCoord);
  #elif DOMAIN == 1
    vec2 uv = gl_FragCoord.xy / resolution;
    vec4 color = vec4(0.0, 0.0, 0.0, 0.0);
  #endif

  vec2 q = vec2(uv.x, (uv.y - beamYPosition) * 2.0);
  float noiseValue = -1.0 + 2.0 * noise(vec2(q.x - time, seed));
  noiseValue *= noiseAmplitude;

  float yDistFromCenter = abs(q.y);
  float insideLineY = step(yDistFromCenter, lineYSize);
  float lineYDistanceFromEdge = distance(yDistFromCenter, lineYSize);
  float lineYGradient = smoothstep(0.0, 1.0 - lineYSharpness, lineYDistanceFromEdge) * insideLineY;

  float insideLineX = step(lineXSize.x, q.x) * step(q.x, lineXSize.y);
  float lineXDist = 1.0 - min(distance(q.x, lineXSize.x), distance(q.x, lineXSize.y));
  lineXDist = max(insideLineX, lineXDist);

  float lineXGradient = smoothstep(lineXSharpness, 1.0, lineXDist);

  float lineGradient = (lineYGradient * lineXGradient) * lineIntensity;
  lineGradient *= 1.0 + noiseValue;

  float bulgeGradient = 1.0 - ellipseGradient(q, bulgeXPosition, bulgeSize);
  bulgeGradient = smoothstep(0.0, 1.0 - bulgeSharpness, bulgeGradient) * bulgeIntensity;
  bulgeGradient *= 1.0 + noiseValue * 0.5;

  float beamGradient = lineGradient + bulgeGradient;
  color += beamGradient * beamColor;

  gl_FragColor = color;
}
