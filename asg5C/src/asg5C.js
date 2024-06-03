import * as THREE from 'three';
import { OBJLoader } from 'obj';
import { OrbitControls } from 'orbit';
import { GUI } from 'gui';
import ThreeMeshUI from 'three-mesh-ui';

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

// UI Canvases
var titleContainer;

// Boolean flags
let inTitleScreen = true;
let inHintScreen, inSelectingScreen, inBattleScreen, inResultsScreen = false;

var titleSceneElements = {
  "kingA": [],
  "pawnsA": [],
  "knightsA": [],
  "bishopsA": [],
  "kingB": [],
  "pawnsB": [],
  "knightsB": [],
  "bishopsB": []
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

function deg2Rad(degree) {
  return degree * (Math.PI / 180);
}

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
  renderer.setSize(window.innerWidth/2, window.innerHeight/2);
  renderer.setPixelRatio(window.devicePixelRatio);

  objLoader = new OBJLoader();

  // Initialize assets
  loadTextures();

  // Create a camera
  const camera = createCamera();
  camera.position.x = 0.5;
  camera.position.y = 1;
  camera.position.z = 25;
  camera.rotateX(deg2Rad(5));

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

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
        titleSceneElements["kingA"].push(kingA);
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
        titleSceneElements["kingB"].push(kingB);
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
        titleSceneElements["pawnsA"].push(pawnA);
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
        titleSceneElements["pawnsA"].push(pawnA);
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
        titleSceneElements["pawnsA"].push(pawnA);
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
        titleSceneElements["pawnsB"].push(pawnB);
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
        titleSceneElements["pawnsB"].push(pawnB);
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
        titleSceneElements["pawnsB"].push(pawnB);
      });
    });

    // ################# Add White Knights ###################
    objLoader.load('../models/pieces/Knight_A_Model.obj', (knightA) => {
      const textureLoader = new THREE.TextureLoader();
    
      textureLoader.load('../img/pieces/Knight_A_Diffuse.jpg', (texture) => {
        // Map texture to the object
        knightA.traverse((child) => {
          if (child instanceof THREE.Mesh) { child.material.map = texture; }
        });
  
        knightA.scale.setScalar(0.15);
        knightA.rotateX(-90 * (Math.PI / 180));
        knightA.rotateZ(180 * (Math.PI / 180));
        knightA.position.set(.5, 9, 7);
    
        titleScene.add(knightA);
        titleSceneElements["knightsA"].push(knightA);
      });
    });

    objLoader.load('../models/pieces/Knight_A_Model.obj', (knightA) => {
      const textureLoader = new THREE.TextureLoader();
    
      textureLoader.load('../img/pieces/Knight_A_Diffuse.jpg', (texture) => {
        // Map texture to the object
        knightA.traverse((child) => {
          if (child instanceof THREE.Mesh) { child.material.map = texture; }
        });
  
        knightA.scale.setScalar(0.15);
        knightA.rotateX(-90 * (Math.PI / 180));
        knightA.rotateZ(180 * (Math.PI / 180));
        knightA.position.set(1.5, 9, 6);
    
        titleScene.add(knightA);
        titleSceneElements["knightsA"].push(knightA);
      });
    });

    objLoader.load('../models/pieces/Knight_A_Model.obj', (knightA) => {
      const textureLoader = new THREE.TextureLoader();
    
      textureLoader.load('../img/pieces/Knight_A_Diffuse.jpg', (texture) => {
        // Map texture to the object
        knightA.traverse((child) => {
          if (child instanceof THREE.Mesh) { child.material.map = texture; }
        });
  
        knightA.scale.setScalar(0.15);
        knightA.rotateX(-90 * (Math.PI / 180));
        knightA.rotateZ(180 * (Math.PI / 180));
        knightA.position.set(-.5, 9, 6);
    
        titleScene.add(knightA);
        titleSceneElements["knightsA"].push(knightA);
      });
    });

    // ################# Add Black Knights ###################
    objLoader.load('../models/pieces/Knight_B_Model.obj', (knightB) => {
      const textureLoader = new THREE.TextureLoader();
    
      textureLoader.load('../img/pieces/Knight_B_Diffuse.jpg', (texture) => {
        // Map texture to the object
        knightB.traverse((child) => {
          if (child instanceof THREE.Mesh) { child.material.map = texture; }
        });
  
        knightB.scale.setScalar(0.15);
        knightB.rotateX(-90 * (Math.PI / 180));
        knightB.rotateZ(180 * (Math.PI / 180));
        knightB.position.set(4.5, -1, 16);
    
        titleScene.add(knightB);
        titleSceneElements["knightsB"].push(knightB);
      });
    });

    objLoader.load('../models/pieces/Knight_B_Model.obj', (knightB) => {
      const textureLoader = new THREE.TextureLoader();
    
      textureLoader.load('../img/pieces/Knight_B_Diffuse.jpg', (texture) => {
        // Map texture to the object
        knightB.traverse((child) => {
          if (child instanceof THREE.Mesh) { child.material.map = texture; }
        });
  
        knightB.scale.setScalar(0.15);
        knightB.rotateX(-90 * (Math.PI / 180));
        knightB.rotateZ(180 * (Math.PI / 180));
        knightB.position.set(5.5, -1, 17);
    
        titleScene.add(knightB);
        titleSceneElements["knightsB"].push(knightB);
      });
    });

    objLoader.load('../models/pieces/Knight_B_Model.obj', (knightB) => {
      const textureLoader = new THREE.TextureLoader();
    
      textureLoader.load('../img/pieces/Knight_B_Diffuse.jpg', (texture) => {
        // Map texture to the object
        knightB.traverse((child) => {
          if (child instanceof THREE.Mesh) { child.material.map = texture; }
        });
  
        knightB.scale.setScalar(0.15);
        knightB.rotateX(-90 * (Math.PI / 180));
        knightB.rotateZ(180 * (Math.PI / 180));
        knightB.position.set(3.5, -1, 17);
    
        titleScene.add(knightB);
        titleSceneElements["knightsB"].push(knightB);
      });
    });

    // ################# Add White Bishops ###################
    objLoader.load('../models/pieces/Bishop_A_Model.obj', (bishopA) => {
      const textureLoader = new THREE.TextureLoader();
    
      textureLoader.load('../img/pieces/Bishop_A_Diffuse.jpg', (texture) => {
        // Map texture to the object
        bishopA.traverse((child) => {
          if (child instanceof THREE.Mesh) { child.material.map = texture; }
        });
  
        bishopA.scale.setScalar(0.15);
        bishopA.rotateX(-90 * (Math.PI / 180));
        bishopA.rotateZ(180 * (Math.PI / 180));
        bishopA.position.set(-3, 9, 7);
    
        titleScene.add(bishopA);
        titleSceneElements["bishopsA"].push(bishopA);
      });
    });

    objLoader.load('../models/pieces/Bishop_A_Model.obj', (bishopA) => {
      const textureLoader = new THREE.TextureLoader();
    
      textureLoader.load('../img/pieces/Bishop_A_Diffuse.jpg', (texture) => {
        // Map texture to the object
        bishopA.traverse((child) => {
          if (child instanceof THREE.Mesh) { child.material.map = texture; }
        });
  
        bishopA.scale.setScalar(0.15);
        bishopA.rotateX(-90 * (Math.PI / 180));
        bishopA.rotateZ(180 * (Math.PI / 180));
        bishopA.position.set(-2, 9, 6);
    
        titleScene.add(bishopA);
        titleSceneElements["bishopsA"].push(bishopA);
      });
    });

    objLoader.load('../models/pieces/Bishop_A_Model.obj', (bishopA) => {
      const textureLoader = new THREE.TextureLoader();
    
      textureLoader.load('../img/pieces/Bishop_A_Diffuse.jpg', (texture) => {
        // Map texture to the object
        bishopA.traverse((child) => {
          if (child instanceof THREE.Mesh) { child.material.map = texture; }
        });
  
        bishopA.scale.setScalar(0.15);
        bishopA.rotateX(-90 * (Math.PI / 180));
        bishopA.rotateZ(180 * (Math.PI / 180));
        bishopA.position.set(-4, 9, 6);
    
        titleScene.add(bishopA);
        titleSceneElements["bishopsA"].push(bishopA);
      });
    });

    // ################# Add Black Bishops ###################
    objLoader.load('../models/pieces/Bishop_B_Model.obj', (bishopB) => {
      const textureLoader = new THREE.TextureLoader();
    
      textureLoader.load('../img/pieces/Bishop_B_Diffuse.jpg', (texture) => {
        // Map texture to the object
        bishopB.traverse((child) => {
          if (child instanceof THREE.Mesh) { child.material.map = texture; }
        });
  
        bishopB.scale.setScalar(0.15);
        bishopB.rotateX(-90 * (Math.PI / 180));
        bishopB.rotateZ(180 * (Math.PI / 180));
        bishopB.position.set(-1, -1, 16);
    
        titleScene.add(bishopB);
        titleSceneElements["bishopsB"].push(bishopB);
      });
    });

    objLoader.load('../models/pieces/Bishop_B_Model.obj', (bishopB) => {
      const textureLoader = new THREE.TextureLoader();
    
      textureLoader.load('../img/pieces/Bishop_B_Diffuse.jpg', (texture) => {
        // Map texture to the object
        bishopB.traverse((child) => {
          if (child instanceof THREE.Mesh) { child.material.map = texture; }
        });
  
        bishopB.scale.setScalar(0.15);
        bishopB.rotateX(-90 * (Math.PI / 180));
        bishopB.rotateZ(180 * (Math.PI / 180));
        bishopB.position.set(0, -1, 17);
    
        titleScene.add(bishopB);
        titleSceneElements["bishopsB"].push(bishopB);
      });
    });

    objLoader.load('../models/pieces/Bishop_B_Model.obj', (bishopB) => {
      const textureLoader = new THREE.TextureLoader();
    
      textureLoader.load('../img/pieces/Bishop_B_Diffuse.jpg', (texture) => {
        // Map texture to the object
        bishopB.traverse((child) => {
          if (child instanceof THREE.Mesh) { child.material.map = texture; }
        });
  
        bishopB.scale.setScalar(0.15);
        bishopB.rotateX(-90 * (Math.PI / 180));
        bishopB.rotateZ(180 * (Math.PI / 180));
        bishopB.position.set(-2, -1, 17);
    
        titleScene.add(bishopB);
        titleSceneElements["bishopsB"].push(bishopB);
      });
    });
  }

  function initializeCanvasText() {
    titleContainer = new ThreeMeshUI.Block({
      width: 0.1,
      height: 0.03,
      padding: 0.005,
      fontFamily: '../lib/assets/Roboto-msdf.json',
      fontTexture: '../lib/assets/Roboto-msdf.png',
    });
     
    //
     
    const titleText = new ThreeMeshUI.Text({
      content: "King's Gambit\n",
      fontSize: 0.008
    });

    const titleInstructionText = new ThreeMeshUI.Text({
      content: "Press Space to Start",
      fontSize: 0.0045
    });
     
    titleContainer.add( titleText, titleInstructionText );

    // Calculate the position in front of the camera
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);

    const cameraPosition = camera.position.clone();
    const targetPosition = cameraPosition.add(cameraDirection.multiplyScalar(near*1.5));

    // Calculate the upward offset
    const upOffset = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    camera.getWorldDirection(upOffset);
    upOffset.set(camera.up.x, camera.up.y, camera.up.z);
    targetPosition.add(upOffset.multiplyScalar(0.01));

    titleContainer.position.copy(targetPosition);

    // Make the container face the camera
    titleContainer.lookAt(camera.position);

    scene.add(titleContainer);
  }

  initializeTitleScreen();
  initializeCanvasText();

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
	directionalLight.position.set( -0.15, 2, 2.88 );
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

  document.onkeydown = keydown;

  
	function render(time) {

		time *= 0.001; // convert time to seconds

    ThreeMeshUI.update();
		renderer.render(scene, camera);

		requestAnimationFrame(render);

	}

  function keydown(ev) {
    // 65 is A, 87 is W, 68 is D
    if (ev.keyCode == 13) { // Enter key
      if (inTitleScreen) {
        console.log("Start game");
        titleContainer.visible = false;
        inTitleScreen = false;
        inHintScreen = true;
      }
    }

    requestAnimationFrame(render);
  }

	requestAnimationFrame(render);
}

main();
