// https://www.shadertoy.com/view/4sBXzG



const int NUM_OCTAVES = 4;
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

float NOISE(vec2 x)
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

float square(float n)
{
  return n * n;
}

vec3 cloudColor = vec3(1.0, 0.0, 0.0);
vec3 streakColor = vec3(0.0, 0.0, 1.0);

void main(void)
{
  vec2 pos = gl_FragCoord.xy;
  float noisy = NOISE(pos);
  float puffy = square(noisy);
    
  vec3 c = clamp(cloudColor * puffy, 0.0, 1.0);

  gl_FragColor = vec4(c, 1.0);
}

vec3 nebula(vec3 dir) {
    float purple = abs(dir.x);
    float yellow = noise(dir.y);
    vec3 streakyHue = vec3(purple + yellow, yellow * 0.7, purple);
    vec3 puffyHue = vec3(0.8, 0.1, 1.0);

    float streaky = min(1.0, 8.0 * pow(NOISE(dir.yz * square(dir.x) * 13.0 + dir.xy * square(dir.z) * 7.0 + vec2(150.0, 2.0)), 10.0));
    float puffy = square(NOISE(dir.xz * 4.0 + vec2(30, 10)) * dir.y);

    return clamp(puffyHue * puffy * (1.0 - streaky) + streaky * streakyHue, 0.0, 1.0);
}