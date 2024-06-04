import * as THREE from 'three';
import { OBJLoader } from 'obj';
import { Timer } from 'timer';
import ThreeMeshUI from 'three-mesh-ui';

// Settings Globals
var fov = 45;
var aspect = 2;  // the canvas default
var near = 0.1;
var far = 200;

// Loaded Textures
var objLoader;

// AI Manager
var playerSelectedTroop = 0;
var enemySelectedTroop = 0; // Pawn = 0, bishop = 1, knight = 2

var playerWins = 0;
var enemyWins = 0;

// Timer manager
var timer;
var timerTarget = 0; // In seconds

var thunderTimer;
var thunderTimerTarget = 0;

// Timer sequencing flags
var waitingToShowBattle = false;
var waitingToShowPlayerTroops = false;
var waitingToShowEnemyTroops = false;
var waitingToUnleashTroops = false;
var waitingToShowResults = false;

// Scenes
var scene;

// Camera positions
var startingCameraPos = [0.5, 1, 25];
var startingCameraRot = [5, 0, 0];

var resultsCameraPos = [0, 0, -4];
var resultsCameraRot = [0, 0, 0];

// UI Canvases
var titleContainer;
var hintContainer;
var selectControlsContainer;
var typeChartCanvas;
var retryContainer;
var resultsContainer;
var resultsText;

var playerTroopCanvas;
var enemyTroopCanvas;

var pawnMaterial;
var bishopMaterial;
var knightMaterial;

var playerWinsContainer;
var enemyWinsContainer;
var playerWinsText;
var enemyWinsText;

// Boolean flags
let inTitleScreen = true;
let inHintScreen, inSelectingScreen, inBattleScreen, inResultsScreen = false;

// Piece positions
var resultsKingPosWin = [-.3, -1, -7];
var resultsKingPosLoss = [0.8, -3, -9];
var resultsKingRotWin = [-90, 0, 0];
var resultsKingRotLoss = [0, -135, 0];

var gamePieceObjects = {
  "kingA": [],
  "pawnsA": [],
  "knightsA": [],
  "bishopsA": [],
  "kingB": [],
  "pawnsB": [],
  "knightsB": [],
  "bishopsB": []
};

var gamePieceStartingPositions = {
  "kingA": [[-.2, 9, 2]],
  "pawnsA": [[2.5, -.8, 5], [1.5, -.8, 4], [3.5, -.8, 4]],
  "knightsA": [[.5, 9, 7], [1.5, 9, 6], [-.5, 9, 6]],
  "bishopsA": [[-3, 9, 7], [-2, 9, 6], [-4, 9, 6]],
  "kingB": [[0, -1, 21]],
  "pawnsB": [[-2.2, -1, 15], [-1.2, -1, 16], [-3.2, -1, 16]],
  "knightsB": [[4.5, -1, 16], [5.5, -1, 17], [3.5, -1, 17]],
  "bishopsB": [[-1, -1, 16], [0, -1, 17], [-2, -1, 17]]
};

var gamePieceStartingRotations = {
  "kingA": [[-90, 0, 0]],
  "pawnsA": [[-90, 0, 0], [-90, 0, 0], [-90, 0, 0]],
  "knightsA": [[-90, 0, 180], [-90, 0, 180], [-90, 0, 180]],
  "bishopsA": [[-90, 0, 180], [-90, 0, 180], [-90, 0, 180]],
  "kingB": [[-90, 0, 0]],
  "pawnsB": [[-90, 0, 0], [-90, 0, 0], [-90, 0, 0]],
  "knightsB": [[-90, 0, 180], [-90, 0, 180], [-90, 0, 180]],
  "bishopsB": [[-90, 0, 180], [-90, 0, 180], [-90, 0, 180]]
};

var gamePieceWhiteBattlePositions = [[-0.5, -1, -10.5], [.3, -1, -11.5], [.3, -1, -9.5]];
var gamePieceWhiteBattleRotations = [[-90, 0, 90], [-90, 0, 90], [-90, 0, 90]];
var gamePieceBlackBattlePositions = [[1, -1, -7], [.4, -1, -8], [.4, -1, -6]];
var gamePieceBlackBattleRotations = [[-90, 0, 90], [-90, 0, 90], [-90, 0, 90]];

function createCamera() {
  return new THREE.PerspectiveCamera(fov, aspect, near, far);
}

function setObjectTransform(object, position, rotation) {
  object.position.set(position[0], position[1], position[2]);
  object.rotation.set(deg2Rad(rotation[0]), deg2Rad(rotation[1]), deg2Rad(rotation[2]));
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

  // Create a camera
  const camera = createCamera();
  setObjectTransform(camera, startingCameraPos, startingCameraRot);

  // Create a timer
  timer = new Timer();
  thunderTimer = new Timer();
  thunderTimerTarget = getRandomInt(15, 25);

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

  function playUIButtonSFX() {
    var uiSFX = new THREE.Audio( listener );

    audioLoader.load( '../audio/ui_button_press.mp3', function( buffer ) {
      uiSFX.setBuffer( buffer );
      uiSFX.setLoop( false );
      uiSFX.setVolume( 0.5 );
      uiSFX.play();
    });
  }

  function playPieceRevealSFX() {
    var uiSFX = new THREE.Audio( listener );

    audioLoader.load( '../audio/piece_reveal.mp3', function( buffer ) {
      uiSFX.setBuffer( buffer );
      uiSFX.setLoop( false );
      uiSFX.setVolume( 0.5 );
      uiSFX.play();
    });
  }

  function playResultsSFX(result) {
    var uiSFX = new THREE.Audio( listener );
    var sfxPath;

    switch (result) {
      case 0:
        sfxPath = '../audio/player_win.ogg';
        break;
      case 1:
        sfxPath = '../audio/player_lose.ogg';
        break;
      case 2:
        sfxPath = '../audio/player_tie.ogg';
        break;
    }

    audioLoader.load( sfxPath, function( buffer ) {
      uiSFX.setBuffer( buffer );
      uiSFX.setLoop( false );
      uiSFX.setVolume( 0.5 );
      uiSFX.play();
    });
  }

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getBattleResult() {
    if ((playerSelectedTroop == 0 && enemySelectedTroop == 1) || (playerSelectedTroop == 1 && enemySelectedTroop == 2) || (playerSelectedTroop == 2 && enemySelectedTroop == 0)) {
      return 0; // player wins
    }

    else if ((playerSelectedTroop == 0 && enemySelectedTroop == 2) || (playerSelectedTroop == 1 && enemySelectedTroop == 0) || (playerSelectedTroop == 2 && enemySelectedTroop == 1)) {
      return 1; // enemy wins
    }

    else {
      return 2; // Tie
    }
  }

  function setUICanvasToCameraPosition(container, offset) {
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
    targetPosition.add(upOffset.multiplyScalar(offset));

    container.position.copy(targetPosition);

    // Make the container face the camera
    container.lookAt(camera.position);
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
        setObjectTransform(kingA, gamePieceStartingPositions["kingA"][0], gamePieceStartingRotations["kingA"][0]);
  
        titleScene.add(kingA);
        gamePieceObjects["kingA"].push(kingA);
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
        setObjectTransform(kingB, gamePieceStartingPositions["kingB"][0], gamePieceStartingRotations["kingB"][0]);
    
        titleScene.add(kingB);
        gamePieceObjects["kingB"].push(kingB);
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
        setObjectTransform(pawnA, gamePieceStartingPositions["pawnsA"][0], gamePieceStartingRotations["pawnsA"][0]);
    
        titleScene.add(pawnA);
        gamePieceObjects["pawnsA"].push(pawnA);
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
        setObjectTransform(pawnA, gamePieceStartingPositions["pawnsA"][1], gamePieceStartingRotations["pawnsA"][1]);
    
        titleScene.add(pawnA);
        gamePieceObjects["pawnsA"].push(pawnA);
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
        setObjectTransform(pawnA, gamePieceStartingPositions["pawnsA"][2], gamePieceStartingRotations["pawnsA"][2]);
    
        titleScene.add(pawnA);
        gamePieceObjects["pawnsA"].push(pawnA);
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
        setObjectTransform(pawnB, gamePieceStartingPositions["pawnsB"][0], gamePieceStartingRotations["pawnsB"][0]);
    
        titleScene.add(pawnB);
        gamePieceObjects["pawnsB"].push(pawnB);
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
        setObjectTransform(pawnB, gamePieceStartingPositions["pawnsB"][1], gamePieceStartingRotations["pawnsB"][1]);
    
        titleScene.add(pawnB);
        gamePieceObjects["pawnsB"].push(pawnB);
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
        setObjectTransform(pawnB, gamePieceStartingPositions["pawnsB"][2], gamePieceStartingRotations["pawnsB"][2]);
    
        titleScene.add(pawnB);
        gamePieceObjects["pawnsB"].push(pawnB);
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
        setObjectTransform(knightA, gamePieceStartingPositions["knightsA"][0], gamePieceStartingRotations["knightsA"][0]);
    
        titleScene.add(knightA);
        gamePieceObjects["knightsA"].push(knightA);
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
        setObjectTransform(knightA, gamePieceStartingPositions["knightsA"][1], gamePieceStartingRotations["knightsA"][1]);
    
        titleScene.add(knightA);
        gamePieceObjects["knightsA"].push(knightA);
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
        setObjectTransform(knightA, gamePieceStartingPositions["knightsA"][2], gamePieceStartingRotations["knightsA"][2]);
    
        titleScene.add(knightA);
        gamePieceObjects["knightsA"].push(knightA);
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
        setObjectTransform(knightB, gamePieceStartingPositions["knightsB"][0], gamePieceStartingRotations["knightsB"][0]);
    
        titleScene.add(knightB);
        gamePieceObjects["knightsB"].push(knightB);
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
        setObjectTransform(knightB, gamePieceStartingPositions["knightsB"][1], gamePieceStartingRotations["knightsB"][1]);
    
        titleScene.add(knightB);
        gamePieceObjects["knightsB"].push(knightB);
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
        setObjectTransform(knightB, gamePieceStartingPositions["knightsB"][2], gamePieceStartingRotations["knightsB"][2]);
    
        titleScene.add(knightB);
        gamePieceObjects["knightsB"].push(knightB);
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
        setObjectTransform(bishopA, gamePieceStartingPositions["bishopsA"][0], gamePieceStartingRotations["bishopsA"][0]);
    
        titleScene.add(bishopA);
        gamePieceObjects["bishopsA"].push(bishopA);
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
        setObjectTransform(bishopA, gamePieceStartingPositions["bishopsA"][1], gamePieceStartingRotations["bishopsA"][1]);
    
        titleScene.add(bishopA);
        gamePieceObjects["bishopsA"].push(bishopA);
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
        setObjectTransform(bishopA, gamePieceStartingPositions["bishopsA"][2], gamePieceStartingRotations["bishopsA"][2]);
    
        titleScene.add(bishopA);
        gamePieceObjects["bishopsA"].push(bishopA);
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
        setObjectTransform(bishopB, gamePieceStartingPositions["bishopsB"][0], gamePieceStartingRotations["bishopsB"][0]);
    
        titleScene.add(bishopB);
        gamePieceObjects["bishopsB"].push(bishopB);
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
        setObjectTransform(bishopB, gamePieceStartingPositions["bishopsB"][1], gamePieceStartingRotations["bishopsB"][1]);
    
        titleScene.add(bishopB);
        gamePieceObjects["bishopsB"].push(bishopB);
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
        setObjectTransform(bishopB, gamePieceStartingPositions["bishopsB"][2], gamePieceStartingRotations["bishopsB"][2]);
    
        titleScene.add(bishopB);
        gamePieceObjects["bishopsB"].push(bishopB);
      });
    });
  }

  function setPiecesToStartingPosition() {
    // set white pieces
    setObjectTransform(gamePieceObjects["kingA"][0], gamePieceStartingPositions["kingA"][0], gamePieceStartingRotations["kingA"][0]);

    for (var i=0; i < gamePieceObjects['pawnsA'].length; i++) {
      setObjectTransform(gamePieceObjects['pawnsA'][i], gamePieceStartingPositions["pawnsA"][i], gamePieceStartingRotations["pawnsA"][i]);
      setObjectTransform(gamePieceObjects['bishopsA'][i], gamePieceStartingPositions["bishopsA"][i], gamePieceStartingRotations["bishopsA"][i]);
      setObjectTransform(gamePieceObjects['knightsA'][i], gamePieceStartingPositions["knightsA"][i], gamePieceStartingRotations["knightsA"][i]);
    }

    // Set black pieces
    setObjectTransform(gamePieceObjects["kingB"][0], gamePieceStartingPositions["kingB"][0], gamePieceStartingRotations["kingB"][0]);

    for (var i=0; i < gamePieceObjects['pawnsB'].length; i++) {
      setObjectTransform(gamePieceObjects['pawnsB'][i], gamePieceStartingPositions["pawnsB"][i], gamePieceStartingRotations["pawnsB"][i]);
      setObjectTransform(gamePieceObjects['bishopsB'][i], gamePieceStartingPositions["bishopsB"][i], gamePieceStartingRotations["bishopsB"][i]);
      setObjectTransform(gamePieceObjects['knightsB'][i], gamePieceStartingPositions["knightsB"][i], gamePieceStartingRotations["knightsB"][i]);
    }
  }

  function initializeCanvasText() {
    titleContainer = new ThreeMeshUI.Block({
      width: 0.1,
      height: 0.03,
      padding: 0.005,
      fontFamily: '../lib/assets/Roboto-msdf.json',
      fontTexture: '../lib/assets/Roboto-msdf.png',
    });
     
    const titleText = new ThreeMeshUI.Text({
      content: "King's Gambit\n",
      fontSize: 0.008
    });

    const titleInstructionText = new ThreeMeshUI.Text({
      content: "Press Enter to Start",
      fontSize: 0.0045
    });
     
    titleContainer.add( titleText, titleInstructionText );
    setUICanvasToCameraPosition(titleContainer, 0.01);

    hintContainer = new ThreeMeshUI.Block({
      width: 0.2,
      height: 0.1,
      padding: 0.0005,
      fontFamily: '../lib/assets/Roboto-msdf.json',
      fontTexture: '../lib/assets/Roboto-msdf.png',
    });

    const hintTitleText = new ThreeMeshUI.Text({
      content: "Tutorial\n",
      fontSize: 0.008
    });

    const hintText = new ThreeMeshUI.Text({
      content: "You have amassed your army and are storming the castle of the rival white clan!\n",
      fontSize: 0.005
    });

    const hintSelectArmyText = new ThreeMeshUI.Text({
      content: "Select which troops you wish to send to battle in the next screen.\n",
      fontSize: 0.005
    });

    const hintCorrectTroopsText = new ThreeMeshUI.Text({
      content: "Troop types have strength and weaknesses over other types. Choose wisely.\n",
      fontSize: 0.005
    });

    const hintWeaknessesText = new ThreeMeshUI.Text({
      content: "Pawns beat bishops, bishops beat knights, knights beat bishops.\n",
      fontSize: 0.005
    });

    const hintNextText = new ThreeMeshUI.Text({
      content: "Press enter to select your troops.\n",
      fontSize: 0.005
    });

    hintContainer.add( hintTitleText, hintText, hintSelectArmyText, hintCorrectTroopsText, hintWeaknessesText, hintNextText );
    setUICanvasToCameraPosition(hintContainer, 0);

    selectControlsContainer = new ThreeMeshUI.Block({
      width: 0.1,
      height: 0.03,
      padding: 0.003,
      interLine: 0.003,
      fontFamily: '../lib/assets/Roboto-msdf.json',
      fontTexture: '../lib/assets/Roboto-msdf.png',
    });

    const selectPawnText = new ThreeMeshUI.Text({
      content: "Press A to send pawns (small pieces)\n",
      fontSize: 0.005
    });

    const selectBishopText = new ThreeMeshUI.Text({
      content: "Press W to send bishops (tall pieces)\n",
      fontSize: 0.005
    });

    const selectKnightText = new ThreeMeshUI.Text({
      content: "Press D to send knights (horse pieces)\n",
      fontSize: 0.005
    });

    selectControlsContainer.add( selectPawnText, selectBishopText, selectKnightText );
    setUICanvasToCameraPosition(selectControlsContainer, -0.04);

    const loader = new THREE.TextureLoader();
    var texture = loader.load( '../img/type_chart.png' );

    var geometry = new THREE.PlaneGeometry();
    var material = new THREE.MeshBasicMaterial( { map: texture ,opacity: 1, transparent: true } );

    typeChartCanvas = new THREE.Mesh( geometry, material );
    typeChartCanvas.scale.setScalar(0.06);
    scene.add( typeChartCanvas );
    setUICanvasToCameraPosition(typeChartCanvas, 0.02);


    var pawnTexture = loader.load( '../img/pawn_icon.png' );
    var bishopTexture = loader.load( '../img/bishop_icon.png' );
    var knightTexture = loader.load( '../img/knight_icon.png' );

    pawnMaterial = new THREE.MeshBasicMaterial( { map: pawnTexture ,opacity: 1, transparent: true } );
    bishopMaterial = new THREE.MeshBasicMaterial( { map: bishopTexture ,opacity: 1, transparent: true } );
    knightMaterial = new THREE.MeshBasicMaterial( { map: knightTexture ,opacity: 1, transparent: true } );

    var geometry = new THREE.PlaneGeometry();

    playerTroopCanvas = new THREE.Mesh( geometry, pawnMaterial );
    playerTroopCanvas.scale.setScalar(0.04);
    scene.add( playerTroopCanvas );

    enemyTroopCanvas = new THREE.Mesh( geometry, pawnMaterial );
    enemyTroopCanvas.scale.setScalar(0.04);
    scene.add( enemyTroopCanvas );

    resultsContainer = new ThreeMeshUI.Block({
      width: 0.1,
      height: 0.013,
      padding: 0.0015,
      interLine: 0.001,
      fontFamily: '../lib/assets/Roboto-msdf.json',
      fontTexture: '../lib/assets/Roboto-msdf.png',
    });
     
    resultsText = new ThreeMeshUI.Text({
      content: "You Win!",
      fontSize: 0.009
    });
     
    resultsContainer.add( resultsText );

    playerWinsContainer = new ThreeMeshUI.Block({
      width: 0.1,
      height: 0.02,
      padding: 0.001,
      interLine: 0.001,
      fontFamily: '../lib/assets/Roboto-msdf.json',
      fontTexture: '../lib/assets/Roboto-msdf.png',
    });
     
    const playerWinsHeaderText = new ThreeMeshUI.Text({
      content: "Your wins:\n",
      fontSize: 0.008
    });

    playerWinsText = new ThreeMeshUI.Text({
      content: "0",
      fontSize: 0.005
    });
     
    playerWinsContainer.add( playerWinsHeaderText, playerWinsText );

    enemyWinsContainer = new ThreeMeshUI.Block({
      width: 0.1,
      height: 0.02,
      padding: 0.001,
      interLine: 0.001,
      fontFamily: '../lib/assets/Roboto-msdf.json',
      fontTexture: '../lib/assets/Roboto-msdf.png',
    });
     
    const enemyWinsHeaderText = new ThreeMeshUI.Text({
      content: "Enemy wins:\n",
      fontSize: 0.008
    });

    enemyWinsText = new ThreeMeshUI.Text({
      content: "0",
      fontSize: 0.005
    });
     
    enemyWinsContainer.add( enemyWinsHeaderText, enemyWinsText );

    retryContainer = new ThreeMeshUI.Block({
      width: 0.1,
      height: 0.01,
      padding: 0.001,
      interLine: 0.003,
      fontFamily: '../lib/assets/Roboto-msdf.json',
      fontTexture: '../lib/assets/Roboto-msdf.png',
    });

    const retryText = new ThreeMeshUI.Text({
      content: "Press Enter to retry battle\n",
      fontSize: 0.005
    });

    retryContainer.add( retryText );

    scene.add(titleContainer);
    scene.add(hintContainer);
    scene.add(selectControlsContainer);
    scene.add(playerWinsContainer);
    scene.add(enemyWinsContainer);
    scene.add(retryContainer);
    scene.add(resultsContainer);

    // Hide unecessary ui
    hintContainer.visible = false;
    selectControlsContainer.visible = false;
    typeChartCanvas.visible = false;
    playerWinsContainer.visible = false;
    enemyWinsContainer.visible = false;
    retryContainer.visible = false;
    resultsContainer.visible = false;
    playerTroopCanvas.visible = false;
    enemyTroopCanvas.visible = false;
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

    // Only update timer if there is a valid timer target
    //console.log(timer.getElapsed());
    if (timerTarget > 0) {
      timer.update();

      if (timer.getElapsed() >= timerTarget) {
        timerTimeout();
      }
    }

    thunderTimer.update();
    if (thunderTimer.getElapsed() >= thunderTimerTarget) {
      thunderTimer._elapsed = 0;
      thunderTimerTarget = getRandomInt(15, 25);

      playThunderClapSFX();
    }

    ThreeMeshUI.update();
		renderer.render(scene, camera);

		requestAnimationFrame(render);

	}

  function keydown(ev) {
    // 65 is A, 87 is W, 68 is D
    if (ev.keyCode == 13) { // Enter key
      if (inTitleScreen) {
        titleContainer.visible = false;
        hintContainer.visible = true;

        playUIButtonSFX();

        inTitleScreen = false;
        inHintScreen = true;
      }

      else if (inHintScreen) {
        hintContainer.visible = false;
        selectControlsContainer.visible = true;
        typeChartCanvas.visible = true;

        playUIButtonSFX();

        inHintScreen = false;
        inSelectingScreen = true;
      }

      else if (inResultsScreen) {
        setObjectTransform(camera, startingCameraPos, startingCameraRot);
        setPiecesToStartingPosition();

        playerWinsContainer.visible = false;
        enemyWinsContainer.visible = false;
        retryContainer.visible = false;
        resultsContainer.visible = false;
        selectControlsContainer.visible = true;
        typeChartCanvas.visible = true;

        playUIButtonSFX();

        inResultsScreen = false;
        inSelectingScreen = true;
      }
    }

    else if (ev.keyCode == 65) { // A key
      if (inSelectingScreen) {
        selectControlsContainer.visible = false;
        typeChartCanvas.visible = false;

        // Properly assign AI Management variables
        playerSelectedTroop = 0;
        enemySelectedTroop = getRandomInt(0, 2);

        playUIButtonSFX();

        inSelectingScreen = false;
        inBattleScreen = true;

        waitingToShowBattle = true;
        startTimer(1);
        //showBattle();
      }
    }

    else if (ev.keyCode == 87) { // W key
      if (inSelectingScreen) {
        selectControlsContainer.visible = false;
        typeChartCanvas.visible = false;

        // Properly assign AI Management variables
        playerSelectedTroop = 1;
        enemySelectedTroop = getRandomInt(0, 2);

        playUIButtonSFX();

        inSelectingScreen = false;
        inBattleScreen = true;

        waitingToShowBattle = true;
        startTimer(1);
        //showBattle();
      }
    }

    else if (ev.keyCode == 68) { // D key
      if (inSelectingScreen) {
        selectControlsContainer.visible = false;
        typeChartCanvas.visible = false;

        // Properly assign AI Management variables
        playerSelectedTroop = 2;
        enemySelectedTroop = getRandomInt(0, 2);

        playUIButtonSFX();

        inSelectingScreen = false;
        inBattleScreen = true;

        waitingToShowBattle = true;
        startTimer(1);
        //showBattle();
      }
    }

    requestAnimationFrame(render);
  }

  function startTimer(time) {
    timerTarget = time;
    timer.reset();
  }

  function timerTimeout() {
    timerTarget = 0;
    timer._elapsed = 0;

    if (waitingToShowBattle) {
      waitingToShowBattle = false;
      waitingToShowPlayerTroops = true;

      showBattle();
    }

    else if (waitingToShowPlayerTroops) {
      waitingToShowPlayerTroops = false;
      waitingToShowEnemyTroops = true;

      // Show which troop the player selected
      playerTroopCanvas.visible = true;

      // Spawn appropriate pieces to their places
      switch (playerSelectedTroop) {
        case 0:
          for (let i=0; i < gamePieceObjects['pawnsB'].length; i++) {
            let pawn = gamePieceObjects['pawnsB'][i];
            setObjectTransform(pawn, gamePieceBlackBattlePositions[i], gamePieceBlackBattleRotations[i]);
          }
          break;
        case 1:
          for (let i=0; i < gamePieceObjects['bishopsB'].length; i++) {
            let bishop = gamePieceObjects['bishopsB'][i];
            setObjectTransform(bishop, gamePieceBlackBattlePositions[i], gamePieceBlackBattleRotations[i]);
          }
          break;
        case 2:
          for (let i=0; i < gamePieceObjects['knightsB'].length; i++) {
            let knight = gamePieceObjects['knightsB'][i];
            setObjectTransform(knight, gamePieceBlackBattlePositions[i], gamePieceBlackBattleRotations[i]);
          }
          break;
      }

      playPieceRevealSFX();

      startTimer(1.2);
    }

    else if (waitingToShowEnemyTroops) {
      waitingToShowEnemyTroops = false;
      waitingToUnleashTroops = true;

      enemyTroopCanvas.visible = true;

      // Spawn appropriate pieces to their places
      switch (enemySelectedTroop) {
        case 0:
          for (let i=0; i < gamePieceObjects['pawnsA'].length; i++) {
            let pawn = gamePieceObjects['pawnsA'][i];
            setObjectTransform(pawn, gamePieceWhiteBattlePositions[i], gamePieceWhiteBattleRotations[i]);
          }
          break;
        case 1:
          for (let i=0; i < gamePieceObjects['bishopsA'].length; i++) {
            let bishop = gamePieceObjects['bishopsA'][i];
            setObjectTransform(bishop, gamePieceWhiteBattlePositions[i], gamePieceWhiteBattleRotations[i]);
          }
          break;
        case 2:
          for (let i=0; i < gamePieceObjects['knightsA'].length; i++) {
            let knight = gamePieceObjects['knightsA'][i];
            setObjectTransform(knight, gamePieceWhiteBattlePositions[i], gamePieceWhiteBattleRotations[i]);
          }
          break;
      }

      playPieceRevealSFX();

      startTimer(1.5);
    }

    else if (waitingToUnleashTroops) {
      waitingToUnleashTroops = false;
      waitingToShowResults = true;

      startTimer(0.8);
    }

    else if (waitingToShowResults) {
      waitingToShowResults = false;

      playerTroopCanvas.visible = false;
      enemyTroopCanvas.visible = false;

      setPiecesToStartingPosition();

      inBattleScreen = false;
      inResultsScreen = true;
      showResults();
    }
  }

  function showBattle() {
    setObjectTransform(camera, resultsCameraPos, resultsCameraRot);

    setUICanvasToCameraPosition(playerTroopCanvas, 0.04);
    playerTroopCanvas.position.x -= 0.055;
    setUICanvasToCameraPosition(enemyTroopCanvas, 0.04);
    enemyTroopCanvas.position.x += 0.055;

    // Change player troop UI depending on what the player selected
    switch (playerSelectedTroop) {
      case 0:
        playerTroopCanvas.material = pawnMaterial;
        break;
      case 1:
        playerTroopCanvas.material = bishopMaterial;
        break;
      case 2:
        playerTroopCanvas.material = knightMaterial;
        break;
    }

    // Change enemy troop UI depending on what the enemy selected
    switch (enemySelectedTroop) {
      case 0:
        enemyTroopCanvas.material = pawnMaterial;
        break;
      case 1:
        enemyTroopCanvas.material = bishopMaterial;
        break;
      case 2:
        enemyTroopCanvas.material = knightMaterial;
        break;
    }

    waitingToShowPlayerTroops = true;
    startTimer(1);
  }

  function showResults() {
    switch (getBattleResult()) {
      case 0:
        playerWins += 1;
        resultsText.set( {content: "YOU WIN" } );
        break;
      case 1:
        enemyWins += 1;
        resultsText.set( {content: "YOU LOSE" } );
        break;
      case 2:
        resultsText.set( {content: "TIE" } );
        break;
    }

    playResultsSFX(getBattleResult());

    resultsContainer.visible = true;
    setUICanvasToCameraPosition(resultsContainer, 0.05);

    playerWinsContainer.visible = true;
    playerWinsText.set( {content: playerWins.toString() } );
    setUICanvasToCameraPosition(playerWinsContainer, 0.03);
    playerWinsContainer.position.x -= 0.055;

    enemyWinsContainer.visible = true;
    enemyWinsText.set( {content: enemyWins.toString() } );
    setUICanvasToCameraPosition(enemyWinsContainer, 0.03);
    enemyWinsContainer.position.x += 0.055;

    retryContainer.visible = true;
    setUICanvasToCameraPosition(retryContainer, -0.05);

    if (getBattleResult() == 0) {
      setObjectTransform(gamePieceObjects["kingB"][0], resultsKingPosWin, resultsKingRotWin);
    }
    else {
      setObjectTransform(gamePieceObjects["kingB"][0], resultsKingPosLoss, resultsKingRotLoss);
    }
  }

	requestAnimationFrame(render);
}

main();
