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

    {

		const color = 0xFFFFFF;
		const intensity = 3;
		const light = new THREE.DirectionalLight( color, intensity );
		light.position.set( - 1, 2, 4 );
		scene.add( light );

	}

    // Load textures
    const loader = new THREE.TextureLoader();
    const texture = loader.load( '../img/wall.jpg' );
    texture.colorSpace = THREE.SRGBColorSpace;

    // load models
    const objLoader = new OBJLoader();
    objLoader.load('../models/PenguinBaseMesh.obj', (root) => {
        scene.add(root);
      });

    // Create a cube
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const cubeGeometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    const cubeMaterial = new THREE.MeshBasicMaterial( { map: texture } );
    const cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
    scene.add(cube);

    // create a sphere
    const sphereRadius = 0.6;
    const wSegments = 8;
    const hSegments = 8;
    const sphereGeometry = new THREE.SphereGeometry( sphereRadius, wSegments, hSegments );

    const sphereMaterial = new THREE.MeshPhongMaterial( { color: 0xffff00 } ); 
    const sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
    scene.add(sphere)
    sphere.position.x = -1.8;

    // create a cylinder
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

	function render( time ) {

		time *= 0.001; // convert time to seconds

		shapes.forEach( ( cube, ndx ) => {

			const speed = 1 + ndx * .1;
			const rot = time * speed;
			cube.rotation.x = rot;
			cube.rotation.y = rot;

		} );

		renderer.render( scene, camera );

		requestAnimationFrame( render );

	}

	requestAnimationFrame( render );
}

main();
