import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import gsap from "gsap"


import Model from './model';

/*------------------------------
Renderer
------------------------------*/
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


/*------------------------------
Scene & Camera
------------------------------*/
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 
  50, 
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.z = 5;
camera.position.y = 1;

scene.rotation.y = Math.PI/6



/*------------------------------
Mesh
------------------------------*/
const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshBasicMaterial( { 
  color: 0x00ff00,
} );
const cube = new THREE.Mesh( geometry, material );
//scene.add( cube );


/*------------------------------
OrbitControls
------------------------------*/
const controls = new OrbitControls( camera, renderer.domElement );


/*------------------------------
Helpers
------------------------------*/
/* const gridHelper = new THREE.GridHelper( 10, 10 );
scene.add( gridHelper );
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper ); */

/*------------------------------
Models
------------------------------*/
const skull = new Model({
  name: "skull",
  file: "./models/skull.glb",
  scene: scene,
  placeOnLoad: true
})

const horse = new Model({
  name: "horse",
  file: "./models/horse.glb",
  scene: scene,
  placeOnLoad: false
})

/*------------------------------
Controllers
------------------------------*/
const buttons = document.querySelectorAll(".button")

buttons[0].addEventListener("click", (e) => {
  skull.add()
  horse.remove()
})

buttons[1].addEventListener("click", (e) => {
  horse.add()
  skull.remove()
})

/*------------------------------
Clock
------------------------------*/
const clock = new THREE.Clock()


/*------------------------------
Loop
------------------------------*/
const animate = function () {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );

    if(skull.isActive){
      skull.particlesMaterial.uniforms.uTime.value = clock.getElapsedTime()
    };

    if(horse.isActive){
      horse.particlesMaterial.uniforms.uTime.value = clock.getElapsedTime()
    };
  }
animate();


/*------------------------------
Resize
------------------------------*/
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
window.addEventListener( 'resize', onWindowResize, false );

/*------------------------------
Mouse Move
------------------------------*/
function onMouseMove(e){
  const x = e.clientX
  const y = e.clientY

  gsap.to(scene.rotation, {
    y: gsap.utils.mapRange(0, window.innerWidth, 0.1, -0.1, x),
    x: gsap.utils.mapRange(0, window.innerHeight, 0.1, -0.1, y),

    //ease: "power1.inOut"
    //y: gsap.utils.mapRange(0, window.innerWidth, 0.1, -0.1, x),
    duration: 0.75, // Adjust the duration for damping effect
    ease: "power1.out" // Use an easing function for smooth damping
  })
}


window.addEventListener("mousemove", onMouseMove)