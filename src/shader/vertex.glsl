uniform float uTime;

attribute vec3 aRandom;

varying vec3 vPosition;

void main() {

  vPosition = position;

  vec3 pos = position;
  pos.x += sin(uTime * aRandom.x) * 0.01;
  pos.y += cos(uTime * aRandom.y) * 0.01;
  pos.z += cos(uTime * aRandom.z) * 0.01;


  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = 8.0 / -mvPosition.z;
}