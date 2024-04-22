import * as THREE from 'three';
import {OBJLoader} from 'obj';

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({antialias: true, canvas});

  // Create a camera
  const fov = 75;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 5;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

  // Move the camera 2 pixels back
  camera.position.z = 2;

  // Create scene
  const scene = new THREE.Scene();

  // Define lighting
	const color = 0xFFFFFF;
	const intensity = 3;
	const light = new THREE.DirectionalLight( color, intensity );
	light.position.set( - 1, 2, 4 );
	scene.add( light );

  // Load basic shape textures
  const loader = new THREE.TextureLoader();
  const texture = loader.load( '../img/wall.jpg' );
  texture.colorSpace = THREE.SRGBColorSpace;

  // load custom 3d models models
  const objLoader = new OBJLoader();
  objLoader.load('../models/PenguinBaseMesh.obj', (penguin) => {
    const textureLoader = new THREE.TextureLoader();

    textureLoader.load('../models/PenguinDiffuseColor.png', (texture) => {
      // Map texture to the object
      penguin.traverse((child) => {
        if (child instanceof THREE.Mesh) { child.material.map = texture; }
      });

      scene.add(penguin);
      penguin.rotation.y = 5;
      penguin.position.z += 0.5;
      penguin.position.x -= 0.9;
      penguin.position.y -= 0.9;
    });
  });

  // Create a cube
  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const cubeGeometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  const cubeMaterial = new THREE.MeshBasicMaterial( { map: texture } );
  const cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
  scene.add(cube);

  // Create a sphere
  const sphereRadius = 0.6;
  const wSegments = 8;
  const hSegments = 8;
  const sphereGeometry = new THREE.SphereGeometry( sphereRadius, wSegments, hSegments );

  const sphereMaterial = new THREE.MeshPhongMaterial( { color: 0xffff00 } ); 
  const sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
  scene.add(sphere)
  sphere.position.x = -1.8;

  // Create a cylinder
  const cylinderRadius = 0.6;
  const cylinderHeight = 1;
  const cylinderSegments = 8;
  const cylinderGeometry = new THREE.CylinderGeometry( cylinderRadius, cylinderRadius, cylinderHeight, cylinderSegments );

  const cylinderMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000 } ); 
  const cylinder = new THREE.Mesh( cylinderGeometry, cylinderMaterial );
  scene.add(cylinder)
  cylinder.position.x = 1.8;

	const shapes = [
		cube,
		sphere,
    cylinder,
	];

	function render(time) {

		time *= 0.001; // convert time to seconds

		shapes.forEach((shape, ndx) => {
			const speed = 1 + ndx * .1;
			const rot = time * speed;
			shape.rotation.x = rot;
			shape.rotation.y = rot;
		});

		renderer.render(scene, camera);

		requestAnimationFrame(render);

	}

	requestAnimationFrame(render);
}

main();
