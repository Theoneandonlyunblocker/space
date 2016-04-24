precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform vec2 offset;
uniform float scale;
uniform float angle;
uniform vec4 stripeColor;
uniform float stripeSize;

void main()
{
  vec4 color = texture2D(uSampler, vTextureCoord);
  
  vec2 pos = gl_FragCoord.xy + offset;
  
  vec2 q;
  q.x = cos(angle) * pos.x - sin(angle) * pos.y;
  q.y = sin(angle) * pos.x + cos(angle) * pos.y;
  
  q /= scale;
  
  float stripeIntensity = sin(q.x) / 2.0 + 0.5;
  stripeIntensity = step(stripeIntensity, stripeSize);
  
  gl_FragColor = mix(color, stripeColor * color.a, stripeIntensity);
}
