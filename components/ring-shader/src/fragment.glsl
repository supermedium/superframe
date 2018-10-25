#define PI 3.14159265358979
uniform float blur;
uniform float progress;
uniform float radiusInner;
uniform float radiusOuter;
uniform vec3 color;

varying vec2 vUv;

void main () {
  vec2 uv = vec2(vUv.x * 2. - 1., vUv.y * 2. - 1.);
  float r = uv.x * uv.x + uv.y * uv.y;
  float col = (1.0 - smoothstep(radiusOuter, radiusOuter + blur, r)) * smoothstep(radiusInner, radiusInner + blur, r);
  float a = smoothstep(-PI, PI, atan(uv.y, uv.x));
  float p = 1.0 - progress - blur;
  col *= smoothstep(p, p + blur, a);
  gl_FragColor = vec4(color * col, col);
}
