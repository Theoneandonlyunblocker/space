precision mediump float;

varying vec2 vTextureCoord;

uniform sampler2D uSampler;

uniform float lifeLeft;

const vec3 spikeColor = vec3(0.3686274509803922, 0.792156862745098, 0.6941176470588235);
const vec3 highlightColor = vec3(1.0);
const vec2 center = vec2(0.5, 0.5);
const float angle = -0.1 * 3.141592;

float diffractionSpike(vec2 pos)
{
  vec2 aligned = pos - center;

  vec2 rotated;
  rotated.x = cos(angle) * aligned.x - sin(angle) * aligned.y;
  rotated.y = sin(angle) * aligned.x + cos(angle) * aligned.y;

  float xStrength = max(0.5 - abs(rotated.x), 0.0);
  float yStrength = max(0.5 - abs(rotated.y), 0.0);

  return xStrength + yStrength;
}

float centerHighlight(vec2 r)
{
  return 1.0 - distance(r, center);
}

void main()
{
  vec2 uv = vTextureCoord;

  vec4 color = texture2D(uSampler, uv);

  // diffraction spike
  float spikeStrength = diffractionSpike(uv);
  spikeStrength = pow(spikeStrength, 1.5);
  spikeStrength -= (1.0 - lifeLeft) * 0.1;
  // spikeStrength *= 0.4;

  color += vec4(spikeColor, 1.0) * spikeStrength;


  // center highlight
  float highlightStrength = centerHighlight(uv);
  highlightStrength = pow(highlightStrength, 3.0);
  highlightStrength *= pow(lifeLeft, 3.0) * 0.5;

  color += vec4(highlightColor, 1.0) * highlightStrength;


  gl_FragColor = color;
}
