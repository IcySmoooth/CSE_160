import * as THREE from 'three';
import { OBJLoader } from 'obj';
import { OrbitControls } from 'orbit';
import { GUI } from 'gui';

// Settings Globals
var fov = 45;
var aspect = 2;  // the canvas default
var near = 0.1;
var far = 200;

// Loaded Textures
var objLoader;
var toyWoodBlockTextureInfo;

// Scenes
const TITLE_SCENE = 0;
var titleScene;
var scene;

var titleSceneElements = {
  "kingA": [],
  "pawnsA": [],
  "knightsA": [],
  "rooksA": [],
  "kingB": [],
  "pawnsB": [],
  "knightsB": [],
  "rooksB": []
}

// Classes
class LoadedTextureInfo {
  constructor(loader, texture) {
    this.loader = loader;
    this.texture = texture;
  }
} 

function createCamera() {
  return new THREE.PerspectiveCamera(fov, aspect, near, far);
}

function loadTextures() {
  // Toy wood texture
  let _toyWoodBlockLoader = new THREE.TextureLoader();
  let _toyWoodBlockTexture = _toyWoodBlockLoader.load('../img/toy_wood_block.jpg', function(_toyWoodBlockTexture) {
    _toyWoodBlockTexture.wrapS = THREE.RepeatWrapping;
    _toyWoodBlockTexture.wrapT = THREE.RepeatWrapping;
    _toyWoodBlockTexture.repeat.set(2, 2); // Repeat the texture 2 times in both directions
  });
  _toyWoodBlockTexture.colorSpace = THREE.SRGBColorSpace;
  toyWoodBlockTextureInfo = new LoadedTextureInfo(_toyWoodBlockLoader, _toyWoodBlockTexture);
}

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(devicePixelRatio);

  objLoader = new OBJLoader();

  // Initialize assets
  loadTextures();

  // Create a camera
  const camera = createCamera();
  camera.position.x = 5;
  camera.position.y = 0;
  camera.position.z = 25;

  // Create audio
  const listener = new THREE.AudioListener();
  camera.add(listener);

  const rainSFX = new THREE.Audio( listener );

  const audioLoader = new THREE.AudioLoader();
  audioLoader.load( '../audio/rain_sounds.mp3', function( buffer ) {
    rainSFX.setBuffer( buffer );
    rainSFX.setLoop( true );
    rainSFX.setVolume( 0.5 );
    rainSFX.play();
  });

  playThunderClapSFX();

  function playThunderClapSFX() {
    var thunderSFX = new THREE.Audio( listener );
    var thunderSFXPath;

    // Get random thunder sound
    switch(getRandomInt(0, 2)) {
      case 0:
        thunderSFXPath = '../audio/thunderclap1.mp3';
        break;
      case 1:
        thunderSFXPath = '../audio/thunderclap2.mp3';
        break;
      case 2:
        thunderSFXPath = '../audio/thunderclap3.mp3';
        break;
    }

    audioLoader.load( thunderSFXPath, function( buffer ) {
      thunderSFX.setBuffer( buffer );
      thunderSFX.setLoop( false );
      thunderSFX.setVolume( 0.5 );
      thunderSFX.play();
    });
  }

  class MinMaxGUIHelper {
    constructor(obj, minProp, maxProp, minDif) {
      this.obj = obj;
      this.minProp = minProp;
      this.maxProp = maxProp;
      this.minDif = minDif;
    }
    get min() {
      return this.obj[this.minProp];
    }
    set min(v) {
      this.obj[this.minProp] = v;
      this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
    }
    get max() {
      return this.obj[this.maxProp];
    }
    set max(v) {
      this.obj[this.maxProp] = v;
      this.min = this.min;  // this will call the min setter
    }
  }

  class ColorGUIHelper {
    constructor(object, prop) {
      this.object = object;
      this.prop = prop;
    }
    get value() {
      return `#${this.object[this.prop].getHexString()}`;
    }
    set value(hexString) {
      this.object[this.prop].set(hexString);
    }
  }

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function updateCamera() {
  	camera.updateProjectionMatrix();
	}

  // Create scene
  const titleScene = new THREE.Scene();
  scene = titleScene;

  function initializeTitleScreen() {
    // Load king models
    objLoader.load('../models/pieces/King_A_Model.obj', (kingA) => {
      const textureLoader = new THREE.TextureLoader();
  
      textureLoader.load('../img/pieces/King_A_Diffuse.jpg', (texture) => {
        // Map texture to the object
        kingA.traverse((child) => {
          if (child instanceof THREE.Mesh) { child.material.map = texture; }
        });

        kingA.scale.setScalar(0.15);
        kingA.position.set(-.2, 9, 2);
        kingA.rotateX(-90 * (Math.PI / 180));
  
        titleScene.add(kingA);
        titleSceneElements["kingA"] = kingA;
      });
    });

    objLoader.load('../models/pieces/King_B_Model.obj', (kingB) => {
      const textureLoader = new THREE.TextureLoader();
    
      textureLoader.load('../img/pieces/King_B_Diffuse.jpg', (texture) => {
        // Map texture to the object
        kingB.traverse((child) => {
          if (child instanceof THREE.Mesh) { child.material.map = texture; }
        });
  
        kingB.scale.setScalar(0.15);
        kingB.position.set(0, -1, 21);
        kingB.rotateX(-90 * (Math.PI / 180));
    
        titleScene.add(kingB);
        titleSceneElements["kingB"] = kingB;
      });
    });

    // ################## Add White Pawns ################
    objLoader.load('../models/pieces/Pawn_A_Model.obj', (pawnA) => {
      const textureLoader = new THREE.TextureLoader();
    
      textureLoader.load('../img/pieces/Pawn_A_Diffuse.jpg', (texture) => {
        // Map texture to the object
        pawnA.traverse((child) => {
          if (child instanceof THREE.Mesh) { child.material.map = texture; }
        });
  
        pawnA.scale.setScalar(0.15);
        pawnA.position.set(2.5, -.8, 5);
        pawnA.rotateX(-90 * (Math.PI / 180));
    
        titleScene.add(pawnA);
        titleSceneElements["pawnsA"] = pawnA;
      });
    });

    objLoader.load('../models/pieces/Pawn_A_Model.obj', (pawnA) => {
      const textureLoader = new THREE.TextureLoader();
    
      textureLoader.load('../img/pieces/Pawn_A_Diffuse.jpg', (texture) => {
        // Map texture to the object
        pawnA.traverse((child) => {
          if (child instanceof THREE.Mesh) { child.material.map = texture; }
        });
  
        pawnA.scale.setScalar(0.15);
        pawnA.position.set(1.5, -.8, 4);
        pawnA.rotateX(-90 * (Math.PI / 180));
    
        titleScene.add(pawnA);
        titleSceneElements["pawnsA"] = pawnA;
      });
    });

    objLoader.load('../models/pieces/Pawn_A_Model.obj', (pawnA) => {
      const textureLoader = new THREE.TextureLoader();
    
      textureLoader.load('../img/pieces/Pawn_A_Diffuse.jpg', (texture) => {
        // Map texture to the object
        pawnA.traverse((child) => {
          if (child instanceof THREE.Mesh) { child.material.map = texture; }
        });
  
        pawnA.scale.setScalar(0.15);
        pawnA.position.set(3.5, -.8, 4);
        pawnA.rotateX(-90 * (Math.PI / 180));
    
        titleScene.add(pawnA);
        titleSceneElements["pawnsA"] = pawnA;
      });
    });

    // ################## Add Black Pawns ################
    objLoader.load('../models/pieces/Pawn_B_Model.obj', (pawnB) => {
      const textureLoader = new THREE.TextureLoader();
    
      textureLoader.load('../img/pieces/Pawn_B_Diffuse.jpg', (texture) => {
        // Map texture to the object
        pawnB.traverse((child) => {
          if (child instanceof THREE.Mesh) { child.material.map = texture; }
        });
  
        pawnB.scale.setScalar(0.15);
        pawnB.position.set(-2.2, -1, 15);
        pawnB.rotateX(-90 * (Math.PI / 180));
    
        titleScene.add(pawnB);
        titleSceneElements["pawnsB"] = pawnB;
      });
    });

    objLoader.load('../models/pieces/Pawn_B_Model.obj', (pawnB) => {
      const textureLoader = new THREE.TextureLoader();
    
      textureLoader.load('../img/pieces/Pawn_B_Diffuse.jpg', (texture) => {
        // Map texture to the object
        pawnB.traverse((child) => {
          if (child instanceof THREE.Mesh) { child.material.map = texture; }
        });
  
        pawnB.scale.setScalar(0.15);
        pawnB.position.set(-1.2, -1, 16);
        pawnB.rotateX(-90 * (Math.PI / 180));
    
        titleScene.add(pawnB);
        titleSceneElements["pawnsB"] = pawnB;
      });
    });

    objLoader.load('../models/pieces/Pawn_B_Model.obj', (pawnB) => {
      const textureLoader = new THREE.TextureLoader();
    
      textureLoader.load('../img/pieces/Pawn_B_Diffuse.jpg', (texture) => {
        // Map texture to the object
        pawnB.traverse((child) => {
          if (child instanceof THREE.Mesh) { child.material.map = texture; }
        });
  
        pawnB.scale.setScalar(0.15);
        pawnB.position.set(-3.2, -1, 16);
        pawnB.rotateX(-90 * (Math.PI / 180));
    
        titleScene.add(pawnB);
        titleSceneElements["pawnsB"] = pawnB;
      });
    });
  }

  initializeTitleScreen();

  // Define hemishpere lighting
  const skyColor = 0xB1E1FF;  // light blue
  const groundColor = 0xB97A20;  // brownish orange
  const hemisphereIntensity = 0.4;
  const hemisphereLight = new THREE.HemisphereLight(skyColor, groundColor, hemisphereIntensity);
  scene.add(hemisphereLight);

  // Define directional lighting
	const directionalColor = 0x6154c4;
	const directionalIntensity = 1.5;
	const directionalLight = new THREE.DirectionalLight( directionalColor, directionalIntensity );
	directionalLight.position.set( - 1, 2, 4 );
  directionalLight.target.position.set(-5, 0, 0);
	scene.add( directionalLight );
  scene.add( directionalLight.target );

  // Define point lighting
  const pointColor = 0xFFFF00;
  const pointIntensity = 75;
  const pointLight1 = new THREE.PointLight(pointColor, pointIntensity);
  pointLight1.position.set(2.5, 4.2, 5.5);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(pointColor, pointIntensity);
  pointLight2.position.set(-2.5, 4.2, 5.5);
  scene.add(pointLight2);

  /*
	const gui = new GUI();
	gui.add( camera, 'fov', 1, 180 ).onChange( updateCamera );
	const minMaxGUIHelper = new MinMaxGUIHelper( camera, 'near', 'far', 0.1 );
	gui.add( minMaxGUIHelper, 'min', 0.1, 50, 0.1 ).name( 'near' ).onChange( updateCamera );
	gui.add( minMaxGUIHelper, 'max', 0.1, 50, 0.1 ).name( 'far' ).onChange( updateCamera );
  gui.addColor(new ColorGUIHelper(directionalLight, 'color'), 'value').name('d_color');
  gui.add(directionalLight, 'intensity', 0, 2, 0.01);
  gui.add(directionalLight.target.position, 'x', -10, 10);
  gui.add(directionalLight.target.position, 'z', -10, 10);
  gui.add(directionalLight.target.position, 'y', 0, 10);
  gui.addColor(new ColorGUIHelper(hemisphereLight, 'color'), 'value').name('h_skyColor');
  gui.addColor(new ColorGUIHelper(hemisphereLight, 'groundColor'), 'value').name('h_groundColor');
  //gui.add(hemisphereLight, 'intensity', 0, 2, 0.01);
  gui.addColor(new ColorGUIHelper(pointLight1, 'color'), 'value').name('p_color1');
  //gui.add(pointLight1, 'intensity', 0, 250, 0.01);
  gui.addColor(new ColorGUIHelper(pointLight2, 'color'), 'value').name('p_color2');
  //gui.add(pointLight2, 'intensity', 0, 250, 0.01); */

	const controls = new OrbitControls( camera, canvas );
	controls.target.set( 0, 5, 0 );
	controls.update();

  // Load basic shape textures
  const loader = new THREE.TextureLoader();
  const texture = loader.load( '../img/wall.jpg' );
  texture.colorSpace = THREE.SRGBColorSpace;

  // load skybox
  const skyLoader = new THREE.TextureLoader();
  const skyTexture = skyLoader.load('../img/sky.jpg');
  skyTexture.colorSpace = THREE.SRGBColorSpace;

  const skyboxWidth = 100;
  const skyboxHeight = 100;
  const skyboxDepth = 100;
  //const skyboxGeometry = new THREE.BoxGeometry(skyboxWidth, skyboxHeight, skyboxDepth);
  const skyboxGeometry = new THREE.SphereGeometry(skyboxWidth, 32, 16);

  const skyboxMaterial = new THREE.MeshBasicMaterial( { map: skyTexture, side: THREE.BackSide } );
  const skybox = new THREE.Mesh( skyboxGeometry, skyboxMaterial );
  scene.add(skybox);

  // load custom 3d models models
  //const objLoader = new OBJLoader();
  objLoader.load('../models/PenguinBaseMesh.obj', (penguin) => {
    const penguinTextureLoader = new THREE.TextureLoader();

    penguinTextureLoader.load('../models/PenguinDiffuseColor.png', (texture) => {
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

  // Create ground plane
  const groundPlaneSize = 70;
  const groundLoader = new THREE.TextureLoader();
  const groundTexture = groundLoader.load('../img/checker.png');
  groundTexture.wrapS = THREE.RepeatWrapping;
  groundTexture.wrapT = THREE.RepeatWrapping;
  groundTexture.magFilter = THREE.NearestFilter;
  groundTexture.colorSpace = THREE.SRGBColorSpace;
  const repeats = groundPlaneSize / 2;
  groundTexture.repeat.set(repeats, repeats);

  const planeGeo = new THREE.PlaneGeometry(groundPlaneSize, groundPlaneSize);
  const planeMat = new THREE.MeshPhongMaterial({
    map: groundTexture,
    side: THREE.DoubleSide,
  });
  const groundMesh = new THREE.Mesh(planeGeo, planeMat);
  groundMesh.rotation.x = Math.PI * -.5;
  groundMesh.position.y -= 1;
  scene.add(groundMesh);

  // Create castle body
  const cobbleWallLoader = new THREE.TextureLoader();
  const cobbleWallTexture = cobbleWallLoader.load('../img/stone_wall.png', function(cobbleWallTexture) {
    cobbleWallTexture.wrapS = THREE.RepeatWrapping;
    cobbleWallTexture.wrapT = THREE.RepeatWrapping;
    cobbleWallTexture.repeat.set(2, 2); // Repeat the texture 2 times in both directions
  });
  cobbleWallTexture.colorSpace = THREE.SRGBColorSpace;

  const castleBodyW = 10;
  const castleBodyH = 10;
  const castleBodyD = 10;
  const castleBodyGeometry = new THREE.BoxGeometry(castleBodyW, castleBodyH, castleBodyD);

  const castleBodyMaterial = new THREE.MeshPhongMaterial( { map: cobbleWallTexture } );
  const castleBody = new THREE.Mesh( castleBodyGeometry, castleBodyMaterial );
  castleBody.position.set(0, 4, 0);
  scene.add(castleBody);

  // Create castle pillars
  const castlePillarR = 1.5; // Radius
  const castlePillarH = 10; // Height
  const castlePillarS = 10; // Segments
  const castlePillarGeometry = new THREE.CylinderGeometry(castlePillarR, castlePillarR, castlePillarH, castlePillarS);
  const castlePillarMaterial = new THREE.MeshPhongMaterial( { map: cobbleWallTexture } );
  // Pillar 1
  const castlePillar1 = new THREE.Mesh( castlePillarGeometry, castlePillarMaterial );
  castlePillar1.position.set(5, 4, 5);
  scene.add(castlePillar1);
  // Pillar 2
  const castlePillar2 = new THREE.Mesh( castlePillarGeometry, castlePillarMaterial );
  castlePillar2.position.set(5, 4, -5);
  scene.add(castlePillar2);
  // Pillar 3
  const castlePillar3 = new THREE.Mesh( castlePillarGeometry, castlePillarMaterial );
  castlePillar3.position.set(-5, 4, 5);
  scene.add(castlePillar3);
  // Pillar 4
  const castlePillar4 = new THREE.Mesh( castlePillarGeometry, castlePillarMaterial );
  castlePillar4.position.set(-5, 4, -5);
  scene.add(castlePillar4);

  // Create castle pillar roofs
  const towerRoofLoader = new THREE.TextureLoader();
  const towerRoofTexture = towerRoofLoader.load('../img/tower_roof.jpg');
  towerRoofTexture.colorSpace = THREE.SRGBColorSpace;

  const castlePillarRoofR = 2; // Radius
  const castlePillarRoofH = 3; // Height
  const castlePillarRoofS = 10; // Segments
  const castlePillarRoofGeometry = new THREE.ConeGeometry(castlePillarRoofR, castlePillarRoofH, castlePillarRoofS);
  const castlePillarRoofMaterial = new THREE.MeshPhongMaterial( { map: towerRoofTexture } );
  // Roof 1
  const castlePillarRoof1 = new THREE.Mesh( castlePillarRoofGeometry, castlePillarRoofMaterial );
  castlePillarRoof1.position.set(5, 10.2, 5);
  scene.add(castlePillarRoof1);
  // Roof 2
  const castlePillarRoof2 = new THREE.Mesh( castlePillarRoofGeometry, castlePillarRoofMaterial );
  castlePillarRoof2.position.set(5, 10.2, -5);
  scene.add(castlePillarRoof2);
  // Roof 3
  const castlePillarRoof3 = new THREE.Mesh( castlePillarRoofGeometry, castlePillarRoofMaterial );
  castlePillarRoof3.position.set(-5, 10.2, 5);
  scene.add(castlePillarRoof3);
  // Roof 4
  const castlePillarRoof4 = new THREE.Mesh( castlePillarRoofGeometry, castlePillarRoofMaterial );
  castlePillarRoof4.position.set(-5, 10.2, -5);
  scene.add(castlePillarRoof4);

  // Create a door
  const doorSquareWidth = 3;
  const doorSquareHeight = 5;
  const doorSquareDepth = 0.5;
  const doorSquareGeometry = new THREE.BoxGeometry(doorSquareWidth, doorSquareHeight, doorSquareDepth);

  const doorSquareMaterial = new THREE.MeshPhongMaterial( { color: 0x000000 } );
  const doorSquare = new THREE.Mesh( doorSquareGeometry, doorSquareMaterial );
  doorSquare.position.set(0, 1.3, 4.79);
  scene.add(doorSquare);

  const doorTopRadius = 1.5;
  const doorTopHeight = 1;
  const doorTopSegments = 15;
  const doorTopGeometry = new THREE.CylinderGeometry( doorTopRadius, doorTopRadius, doorTopHeight, doorTopSegments );

  const doorTopMaterial = new THREE.MeshPhongMaterial( { color: 0x000000 } ); 
  const doorTop = new THREE.Mesh( doorTopGeometry, doorTopMaterial );
  doorTop.position.set(0, 3.2, 4.6);
  doorTop.rotateX(90 * (Math.PI / 180));
  scene.add(doorTop)

  // Create drawbridge
  const woodBridgeLoader = new THREE.TextureLoader();
  const woodBridgeTexture = woodBridgeLoader.load('../img/wood_bridge.jpg', function(woodBridgeTexture) {
    //cobbleWallTexture.wrapS = THREE.RepeatWrapping;
    woodBridgeTexture.wrapT = THREE.RepeatWrapping;
    woodBridgeTexture.repeat.set(1, 2); // Repeat the texture 2 times in both directions
  });
  woodBridgeTexture.colorSpace = THREE.SRGBColorSpace;

  const woodBridgeW = 4;
  const woodBridgeH = 0.4;
  const woodBridgeD = 8;
  const woodBridgeGeometry = new THREE.BoxGeometry( woodBridgeW, woodBridgeH, woodBridgeD );

  const woodBridgeMaterial = new THREE.MeshPhongMaterial( { map: woodBridgeTexture } ); 
  const woodBridge = new THREE.Mesh( woodBridgeGeometry, woodBridgeMaterial );
  woodBridge.position.set(0, -1, 9);
  scene.add(woodBridge);

  // Create torches
  const torchLoader = new THREE.TextureLoader();
  const torchTexture = torchLoader.load('../img/wood_torch.jpg', function(torchTexture) {
    //cobbleWallTexture.wrapS = THREE.RepeatWrapping;
    torchTexture.wrapT = THREE.RepeatWrapping;
    torchTexture.repeat.set(1, 2); // Repeat the texture 2 times in both directions
  });
  torchTexture.colorSpace = THREE.SRGBColorSpace;

  const torchRadius = 0.3;
  const torchHeight = 2;
  const torchSegments = 8;
  const torchGeometry = new THREE.CylinderGeometry( torchRadius, torchRadius, torchHeight, torchSegments );

  const torchMaterial = new THREE.MeshPhongMaterial( { map: torchTexture } ); 
  const torch1 = new THREE.Mesh( torchGeometry, torchMaterial );
  torch1.position.set(2.5, 3.2, 5.2);
  torch1.rotateX(15 * (Math.PI / 180));
  scene.add(torch1);

  const torch2 = new THREE.Mesh( torchGeometry, torchMaterial );
  torch2.position.set(-2.5, 3.2, 5.2);
  torch2.rotateX(15 * (Math.PI / 180));
  scene.add(torch2);

  
	function render(time) {

		time *= 0.001; // convert time to seconds

		renderer.render(scene, camera);

		requestAnimationFrame(render);

	}

	requestAnimationFrame(render);
}

main();
