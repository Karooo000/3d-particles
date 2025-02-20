import * as THREE from "three"
import gsap from "gsap"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js"
import {MeshSurfaceSampler} from "three/examples/jsm/math/MeshSurfaceSampler.js"

import vertexShader from "./shader/vertex.glsl"
import fragmentShader from "./shader/fragment.glsl"



class Model {
    constructor (obj) {

        this.name = obj.name
        this.file = obj.file
        this.scene = obj.scene
        this.placeOnLoad = obj.placeOnLoad

        this.isActive = false

        this.loader = new GLTFLoader()
        this.dracoLoader = new DRACOLoader()
        this.dracoLoader.setDecoderPath("./draco/")
        this.loader.setDRACOLoader(this.dracoLoader)

        this.init()
    }

    init(){
        this.loader.load(this.file, (res) => {

            /*------------------------------
            Original Mesh
            ------------------------------*/
            this.mesh = res.scene.children[0]

            /*------------------------------
            Material
            ------------------------------*/
            this.material = new THREE.MeshBasicMaterial({
                color: "red",
                wireframe: true
            })

            this.mesh.material = this.material

            /*------------------------------
            Geometry Mesh
            ------------------------------*/
            this.geometry = this.mesh.geometry



            /*------------------------------
            Particles Material
            ------------------------------*/
           //this.particlesMaterial = new THREE.PointsMaterial({size: 0.01})

           this.particlesMaterial = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uTime: {value: 0.0},
                uScale: {value: 0.0}
            }
           })


            /*------------------------------
            Particles Geometry
            ------------------------------*/
            const sampler = new MeshSurfaceSampler(this.mesh).build()
            const numParticles = 10000

            this.particlesGeometry = new THREE.BufferGeometry()

            this.particlesPosition = new Float32Array(numParticles * 3)

            const randomPosArr = new Float32Array(numParticles * 3)

            for(let i = 0; i < numParticles; i++){
                const newPosition = new THREE.Vector3()
                sampler.sample(newPosition)

                this.particlesPosition.set([
                    newPosition.x,
                    newPosition.y,
                    newPosition.z
                ], i * 3)

                randomPosArr.set([
                    Math.random() * 2 - 1,
                    Math.random() * 2 - 1,
                    Math.random() * 2 - 1
                ], i * 3)
            }

            

            this.particlesGeometry.setAttribute("position", new THREE.BufferAttribute(this.particlesPosition, 3))
            this.particlesGeometry.setAttribute("aRandom", new THREE.BufferAttribute(randomPosArr, 3))

            

            console.log(this.particlesGeometry)

            /*------------------------------
            Particles
            ------------------------------*/
            this.particles = new THREE.Points(this.particlesGeometry, this.particlesMaterial)


            /*------------------------------
            Place on load
            ------------------------------*/
            if(this.placeOnLoad){this.add()}

        })
    }
    
    add(){
        this.scene.add(this.particles)
        this.isActive = true

        gsap.to(this.particlesMaterial.uniforms.uScale, {
            value: 1, 
            duration: 2
        })
    }

    remove(){
        
        gsap.to(this.particlesMaterial.uniforms.uScale, {
            value: 0,
            onComplete: () => {
                this.scene.remove(this.particles)
                this.isActive = false

            }
        })
    }
}

export default Model