uniform float uTime;
uniform float uScale;

attribute vec3 aRandom;

varying vec3 vPosition;
varying vec2 vUv;

void main() {

  vPosition = position;
  vUv = uv;

  float time = uTime * 4.0;

  vec3 pos = position;
  pos.x += sin(uTime * aRandom.x) * 0.01;
  pos.y += cos(uTime * aRandom.y) * 0.01;
  pos.z += cos(uTime * aRandom.z) * 0.01;

  //pos *= uScale;

  pos.x *= uScale + sin(pos.y * 4.0 + time) * (1.0 - uScale);
  pos.y *= uScale + cos(pos.z * 4.0 + time) * (1.0 - uScale);
  pos.z *= uScale + sin(pos.x * 4.0 + time) * (1.0 - uScale);


  pos *= uScale;

  vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = 8.0 / -mvPosition.z;
}