var VSHADER_SOURCE = `
    precision mediump float;
    attribute vec4 a_Position;
    attribute vec2 a_UV;
    varying vec2 v_UV;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_GlobalRotateMatrix;
    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ProjectionMatrix;
    void main(){
        gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
        v_UV = a_UV;
    }`;

// Attribute variables used for getting data

let FSHADER_SOURCE = `
    precision mediump float;
    varying vec2 v_UV;
    uniform vec4 u_FragColor;
    uniform sampler2D u_Sampler0;
    uniform int u_WhichTexture;
    void main(){
        if (u_WhichTexture == -2) {                       // Use color
            gl_FragColor = u_FragColor;
        } else if (u_WhichTexture == -1) {                // Use UV debug color
            gl_FragColor = vec4(v_UV, 1.0, 1.0);
        } else if (u_WhichTexture == 0) {                 // Use texture0
            gl_FragColor = texture2D(u_Sampler0, v_UV);
        } else {                                        // Error
            gl_FragColor = vec4(1, .2, .2, 1);
        }
    }`;

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// Global variables
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_WhichTexture;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_sampler0;

let g_selectedType = POINT;
let shapeColor = [1.0, 1.0, 1.0, 1.0];
let shapeSize = 5;

// Animation variables
let g_swimAnimation=false;
let g_headPosition = 0;
let g_headAngle = 0;
let g_body1Angle = 0;
let g_body2Angle = 0;
let g_body3Angle = 0;
let g_finAngle = 0;

let g_globalAngle = 0;

// User Mouse controls
let isRotatingCamera = false;
let prevMousePos = [ 0.0, 0.0 ];

function setupWebGL() {
    // Set up canvas reference 
    canvas = document.getElementById("webgl");

    // Initialize WebGL context
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
    if (!gl) {
        console.log("Failed to get WebGL context.");
        return;
    }

    gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL() {
    // Compile and initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log("Failed to load/compile shaders.");
        return;
    }

    // Get the pointer location of a_Position
    a_Position = gl.getAttribLocation(gl.program, "a_Position");
    if (a_Position < 0) {
        console.log("Failed to get storage location of a_Position.");
        return;
    }

    // Get the pointer location of a_UV
    a_UV = gl.getAttribLocation(gl.program, "a_UV");
    if (a_UV < 0) {
        console.log("Failed to get storage location of a_UV.");
        return;
    }

    // Get pointer location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
    if (!u_FragColor) {
        console.log("Failed to get storage location of u_FragColor.");
        return;
    }

    // Get pointer location of u_WhichTexture
    u_WhichTexture = gl.getUniformLocation(gl.program, "u_WhichTexture");
    if (!u_WhichTexture) {
        console.log("Failed to get storage location of u_WhichTexture.");
        return;
    }

    // Get pointer location of u_ModelMatrix
    u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
    if (!u_ModelMatrix) {
        console.log("Failed to get storage location of u_ModelMatrix.");
        return;
    }

    // Get pointer location of u_GlobalRotateMatrix
    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, "u_GlobalRotateMatrix");
    if (!u_GlobalRotateMatrix) {
        console.log("Failed to get storage location of u_GlobalRotateMatrix.");
        return;
    }

    // Get pointer location of u_ViewMatrix
    u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix");
    if (!u_ViewMatrix) {
        console.log("Failed to get storage location of u_ViewMatrix.");
        return;
    }

    // Get pointer location of u_ProjectionMatrix
    u_ProjectionMatrix = gl.getUniformLocation(gl.program, "u_ProjectionMatrix");
    if (!u_ProjectionMatrix) {
        console.log("Failed to get storage location of u_ProjectionMatrix.");
        return;
    }

    // Get pointer location of u_Sampler
    u_Sampler0 = gl.getUniformLocation(gl.program, "u_Sampler0");
    if (!u_Sampler0) {
        console.log("Failed to create the storage location of u_Sampler");
        return false;
    }

    // Intial value for matrix identity
    var identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

function initTextures() {
    var image = new Image(); // Create image object
    if (!image) {
        console.log("Failed to create the image object");
        return false;
    }
    // Register event handler to be called on loading an image
    image.onload = function() { sendImageToTEXTURE0(image); };
    image.src = "rat.jpg"; // Tell the browser to load an image

    // TODO: Add more texture loading

    return true;
}

function sendImageToTEXTURE0(image) {
    var texture = gl.createTexture(); // Create texture object
    if (!texture) {
        console.log("Failed to create the texture object");
        return false;
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y-axis
    gl.activeTexture(gl.TEXTURE0); // Enable texture unit0
    gl.bindTexture(gl.TEXTURE_2D, texture); // Bind the texture object to the target

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); // Set texture parameters
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image); // Set texture image

    gl.uniform1i(u_sampler0, 0); // Set the texture unit 0 to the sampler

    console.log("finished loadTexture");

}

function addActionsForHtmlUI() {
    // Button Events
    document.getElementById("animationYellowOnButton").onclick = function() {g_swimAnimation = true;};
    document.getElementById("animationYellowOffButton").onclick = function() {g_swimAnimation = false;};

    // Slider Events
    document.getElementById("headSlide").addEventListener('mousemove', function(){ g_headAngle = this.value; renderAllShapes(); });
    document.getElementById("body1Slide").addEventListener('mousemove', function(){ g_body1Angle = this.value; renderAllShapes(); });
    document.getElementById("body2Slide").addEventListener('mousemove', function(){ g_body2Angle = this.value; renderAllShapes(); });
    document.getElementById("body3Slide").addEventListener('mousemove', function(){ g_body3Angle = this.value; renderAllShapes(); });
    document.getElementById("angleSlide").addEventListener('mousemove', function(){ g_globalAngle = this.value; renderAllShapes(); });
}

function sendTextToHTML(text, htmlID) {
    var htmlElm = document.getElementById(htmlID);
    if (!htmlID) {
        console.log("Failed to get " + htmlID + " from HTML.");
        return false;
    }
    htmlElm.innerHTML = text;
}

function onClick(ev) {
    isRotatingCamera = true;
    prevMousePos = convertCoordinatesEventToGL(ev);
}

function updateCamera(new_mouse_pos) {
    if (new_mouse_pos[0] > prevMousePos[0]) {
        g_globalAngle += 1;
    }

    else if (new_mouse_pos[0] < prevMousePos[0]) {
        g_globalAngle -= 1;
    }

    prevMousePos = new_mouse_pos;
}

function convertCoordinatesEventToGL(ev) {
    let x = ev.clientX; // X coordinate of a mouse pointer
    let y = ev.clientY // Y coordinate of a mouse pointer
    let rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width/2) / (canvas.width/2);
    y = (canvas.height/2 - (y - rect.top)) / (canvas.height/2);

    return ([x, y]);
}

function updateAnimationAngles() {
    if (g_swimAnimation) {
        g_headPosition = (.3*Math.sin(g_seconds));
        g_headAngle = (30*Math.sin(g_seconds));

        var delayFactor = 0.5;
        g_body1Angle = (10*Math.cos(g_seconds - delayFactor));
        g_body2Angle = (10*Math.cos(g_seconds - delayFactor*2));
        g_body3Angle = (10*Math.cos(g_seconds - delayFactor*3));

        g_finAngle = (10*Math.cos(g_seconds - delayFactor*2));
    }
}

function renderAllShapes() {
    // Check time at start of function
    var startTime = performance.now()

    var projMat = new Matrix4();
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

    var viewMat = new Matrix4();
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

    var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clear(gl.COLOR_BUFFER_BIT); // Clear canvas

    // Head
    var head = new Cube();
    head.color = [1, 1, 0, 1];
    head.matrix.translate(-.5, -.2, g_headPosition);
    //head.matrix.rotate(g_headAngle, 0, 1, 0);
    head.matrix.rotate(g_headAngle, 1, 1, 0);
    head.matrix.scale(.2, .2, .2);
    var headCoordMat = new Matrix4(head.matrix);
    head.render();

    // Right eye
    var rEye = new Cube();
    rEye.color = [0, 0, 0, 1];
    rEye.matrix = new Matrix4(headCoordMat);
    rEye.matrix.translate(0, .5, -.05);
    //lEye.matrix.rotate(g_headAngle, 0, 1, 0);
    rEye.matrix.scale(.2, .2, .05);
    rEye.render();

    // Left eye
    var lEye = new Cube();
    lEye.color = [0, 0, 0, 1];
    lEye.matrix = new Matrix4(headCoordMat);
    lEye.matrix.translate(0, .5, 1.03);
    //lEye.matrix.rotate(g_headAngle, 0, 1, 0);
    lEye.matrix.scale(.2, .2, .05);
    lEye.render();

    // Body Segment 1
    var body1 = new Cube();
    body1.color = [1, 0, 0, 1];
    body1.matrix = headCoordMat;
    body1.matrix.translate(1, -.45, -.165);
    body1.matrix.rotate(g_body1Angle, 0, 1, 0);
    body1.matrix.scale(2, 2, 1.3);
    var body1CoordMat = new Matrix4(body1.matrix);
    body1.render();

    // Body Segment 2
    var body2 = new Cube();
    body2.color = [1, .1, .1, 1];
    body2.matrix = body1CoordMat;
    body2.matrix.translate(0.99, 0.1, .1);
    body2.matrix.rotate(g_body2Angle, 0, 1, 0);
    body2.matrix.scale(.7, .8, .8);
    var body2CoordMat = new Matrix4(body2.matrix);
    body2.render();

    // Body Segment 3
    var body3 = new Cube();
    body3.color = [1, .2, .2, 1];
    body3.matrix = body2CoordMat;
    body3.matrix.translate(0.99, 0.1, .1);
    body3.matrix.rotate(g_body3Angle, 0, 1, 0);
    body3.matrix.scale(.7, .8, .8);
    var body3CoordMat = new Matrix4(body3.matrix);
    body3.render();

    // Left fin
    var lFin = new Cube();
    lFin.color = [1, 1, 0, 1];
    lFin.matrix = new Matrix4(body1CoordMat);
    lFin.matrix.translate(-1, 0, -.3);
    lFin.matrix.rotate(-15, 0, 0, 1);
    lFin.matrix.scale(.6, .4, .2);
    lFin.matrix.rotate(g_finAngle, 0, 1, 0);
    lFin.render();

    // Right fin
    var rFin = new Cube();
    rFin.color = [1, 1, 0, 1];
    rFin.matrix = new Matrix4(body1CoordMat);
    rFin.matrix.translate(-1, 0, 1.1);
    rFin.matrix.rotate(-15, 0, 0, 1);
    rFin.matrix.scale(.6, .4, .2);
    rFin.matrix.rotate(g_finAngle, 0, 1, 0);
    rFin.render();

    // Check the timer at the end of the function
    var duration = performance.now() - startTime;
    sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(1000/duration), "performance");
}

function main() {
    setupWebGL();
    connectVariablesToGLSL();
    addActionsForHtmlUI();
    canvas.onmousedown = onClick; // Register function to be called on mouse click
    canvas.onmouseup = function(ev) { isRotatingCamera = false; };
    canvas.onmousemove = function(ev) { if (ev.buttons == 1) { updateCamera(convertCoordinatesEventToGL(ev)); } };

    initTextures();

    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Specify color for clearing the canvas
    //gl.clear(gl.COLOR_BUFFER_BIT); // Clear canvas
    requestAnimationFrame(tick);
}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0-g_startTime;

function tick() {
    g_seconds = performance.now()/1000.0-g_startTime;
    updateAnimationAngles();
    renderAllShapes();

    // Tell browser to update again when it has the chance
    requestAnimationFrame(tick);
}