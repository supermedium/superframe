#extension GL_OES_standard_derivatives : enable
#define PI 3.14159265358979
uniform float blur;
uniform float progress;
uniform float radiusInner;
uniform float radiusOuter;
uniform vec3 color;

varying vec2 vUv;

void main () {
  // make uvs go from -1 to 1
  vec2 uv = vec2(vUv.x * 2.0 - 1.0, vUv.y * 2.0 - 1.0);
  // calculate distance of fragment to center
  float r = uv.x * uv.x + uv.y * uv.y;
  // calculate antialias
  float aa = fwidth(r);
  // make full circle (radiusOuter - radiusInner)
  float col = (1.0 - smoothstep(radiusOuter - aa, radiusOuter + blur + aa, r)) * smoothstep(radiusInner - aa, radiusInner + blur + aa, r);
  // radial gradient
  float a = smoothstep(-PI-aa, PI+aa, atan(uv.y, uv.x));
  // progress angle
  float p = 1.0 - progress - blur;
  // apply progress to full circle (1 for done part, 0 for part to go)
  col *= smoothstep(p, p + blur, a);
  // multiply by user color
  gl_FragColor = vec4(color * col, col);
}
