#define PI 3.141592

precision mediump float;

varying vec2 vTextureCoord;

uniform sampler2D uSampler;

uniform float lifeLeft;

const vec3 color = vec3(0.3686274509803922, 0.792156862745098, 0.6941176470588235);
const vec2 center = vec2(0.5, 0.5);


float diffraction(vec2 r)
{
  float xDist = abs(r.x - center.x);
  float yDist = abs(r.y - center.y);
  float proximityToCenter = 1.0 - (xDist + yDist);
  float proximityToOrthogonal = 0.5 - min(xDist, yDist);

  return 1.0;
}

void main()
{
  vec2 uv = vTextureCoord;
  vec2 r = uv - center;

  // float angle = 0.25 * PI;
  float angle = 0.0001;
  vec2 q;
  q.x = cos(angle) * r.x - sin(angle) * r.y;
  q.y = sin(angle) * r.x + cos(angle) * r.y;


  float xDist = abs(q.x);
  float yDist = abs(q.y);

  float proximityToCenter = 1.0 - 2.0 * (xDist + yDist);

  float intensity = proximityToCenter * lifeLeft;

  // float dist = 1.0 - distance(uv, center);
  // float intensity = pow(dist, 3.0) * lifeLeft;

  gl_FragColor = mix(texture2D(uSampler, uv), vec4(1.0, 0.0, 0.0, 1.0), intensity);
}
