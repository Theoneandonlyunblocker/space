precision mediump float;

uniform float frontier;
uniform float trailDistance;
uniform float seed;
uniform float blockSize;
uniform float blockWidth;
uniform float lineAlpha;
uniform float blockAlpha;


float minX = frontier - trailDistance;
float maxX = frontier + 20.0;
float frontGradientStart = frontier + 17.0;
float blockEnd = maxX;

float hash(float n)
{
  return fract(sin(n) * 1e4);
}
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


vec4 makeLines(vec2 coord)
{
  float gradientAlpha = smoothstep(minX, frontier, coord.x);
  gradientAlpha -= smoothstep(frontGradientStart, maxX, coord.x);
  gradientAlpha += 0.5 * gradientAlpha;

  float n = noise(vec2(seed, coord.y));
  n = pow(n, 3.5);
  float alpha = n * gradientAlpha;


  float r = hash(vec2(seed, coord.y));
  r = clamp(r, 0.8, 0.9) * alpha;
  float g = (r + 0.7 - r) * alpha;
  float b = smoothstep(0.0, 0.28, alpha);

  return vec4(r, g, b, alpha);
}

vec4 makeBlocks(vec2 coord)
{
  vec4 lineColor = makeLines(vec2(frontier, coord.y));
  float h = hash(vec2(seed, coord.y));
  float blockWidth = blockWidth * (h / 2.0 + 0.5);

  float blockStart = frontier - blockWidth;
  float alpha = step(0.01, mod(smoothstep(blockStart, blockEnd, coord.x), 1.0));


  return lineColor * alpha;
}

void main()
{
  vec4 lineColor = makeLines(gl_FragCoord.xy);

  vec4 blockColor = vec4(0.0);

  for (float i = 0.0; i < 10.0; i += 1.0)
  {
    float y = gl_FragCoord.y + hash(i) * blockSize * 20.0;
    float blockY = floor(y / blockSize);
    blockColor += makeBlocks(vec2(gl_FragCoord.x, blockY)) * 0.2;
  }

  gl_FragColor = lineColor * lineAlpha + blockColor * blockAlpha;
}
