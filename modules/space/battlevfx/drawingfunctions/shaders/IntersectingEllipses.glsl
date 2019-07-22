precision mediump float;

#define DOMAIN 0 // 0 == pixi, 1 == shdr.bkcore.com

#if DOMAIN == 0
  varying vec2 vTextureCoord;
  uniform sampler2D uSampler;

  uniform vec4 mainColor;
  uniform float mainAlpha;

  uniform vec2 intersectingEllipseCenter;
  uniform vec2 intersectingEllipseSize;
  uniform float intersectingEllipseSharpness;

  uniform vec2 mainEllipseSize;
  uniform float mainEllipseSharpness;

#elif DOMAIN == 1
  uniform vec2 resolution;
  uniform float time;

  const vec4 mainColor = vec4(1.0, 1.0, 1.0, 1.0);
  const float mainAlpha = 1.0;

  const vec2 intersectingEllipseCenter = vec2(0.4, 0.0);
  const vec2 intersectingEllipseSize = vec2(0.8, 1.0);
  const float intersectingEllipseSharpness = 0.6;

  const vec2 mainEllipseSize = vec2(0.5, 0.9);
  const float mainEllipseSharpness = 0.8;

#endif


float ellipseGradient(vec2 p, vec2 ellipseCenter, vec2 ellipseSize)
{
  vec2 q = p - ellipseCenter;
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

  vec2 q = -1.0 + 2.0 * uv;

  float mainDist = 1.0 - ellipseGradient(q, vec2(0.0, 0.0), mainEllipseSize);
  float mainGradient = smoothstep(0.0, 1.0 - mainEllipseSharpness, mainDist);
  color += mainColor * mainGradient;


  float intersectingDist = ellipseGradient(q, intersectingEllipseCenter, intersectingEllipseSize);

  float intersectingMask = step(intersectingEllipseSharpness, intersectingDist);
  color *= intersectingMask;

  float intersectingGradient = smoothstep(intersectingEllipseSharpness, 1.0, intersectingDist);
  color *=  intersectingGradient;

  gl_FragColor = color * mainAlpha;
}
