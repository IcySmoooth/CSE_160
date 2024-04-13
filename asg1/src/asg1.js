let VERTEX_SHADER = `
    precision mediump float;

    attribute vec3 a_Position;
    uniform float u_Size;

    void main(){
        gl_Position = vec4(a_Position, 1.0);
        gl_PointSize = u_Size;
    }

`;

// Attribute variables used for getting data

let FRAGMENT_SHADER = `
    precision mediump float;

    uniform vec3 u_Color;

    void main(){
        gl_FragColor = vec4(u_Color, 1.0); // Set the point color
    }

`;

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// Global variables
let canvas;
let gl;
let a_Position;
let u_Color;
let u_Size;

let g_selectedType = POINT;
let shapeColor = [1.0, 1.0, 1.0];
let shapeSize = 5;
let segmentCount = 3;
let g_shapesList = [];

function setupWebGL() {
    // Set up canvas reference 
    canvas = document.getElementById("webgl");

    // Initialize WebGL context
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });

    if (!gl) {
        console.log("Failed to get WebGL context.");
        return false;
    }
}

function connectVariablesToGLSL() {
    // Compile and initialize shaders
    if (!initShaders(gl, VERTEX_SHADER, FRAGMENT_SHADER)) {
        console.log("Failed to load/compile shaders.");
        return false;
    }

    // Get the pointer location of a_Position
    a_Position = gl.getAttribLocation(gl.program, "a_Position");
    if (a_Position < 0) {
        console.log("Failed to get storage location of a_Position.");
        return false;
    }

    // Get pointer location of u_Color
    u_Color = gl.getUniformLocation(gl.program, "u_Color");
    if (!u_Color) {
        console.log("Failed to get storage location of u_Color.");
        return false;
    }

    // Get pointer location of u_Size
    u_Size = gl.getUniformLocation(gl.program, "u_Size");
    if (!u_Size) {
        console.log("Failed to get storage location of u_Size.");
        return false;
    }
}

function click(ev) {
    // Convert event click into WebGL Coordinates
    let [x, y] = convertCoordinatesEventToGL(ev);
    
    //let point = new Point();
    let point;

    if (g_selectedType == POINT) {
        point = new Point();
    }
    else if (g_selectedType == TRIANGLE){
        point = new Triangle();
    }
    else {
        point = new Circle();
        point.segments = segmentCount;
    }
    
    point.position = [x, y];          // Store coordinates
    point.color = shapeColor.slice(); // Store colors
    point.size = shapeSize;           // Store sizes
    g_shapesList.push(point);         // Store point

    renderAllShapes();
}

function convertCoordinatesEventToGL(ev) {
    let x = ev.clientX; // X coordinate of a mouse pointer
    let y = ev.clientY // Y coordinate of a mouse pointer
    let rect = ev.target.getBoundingClientRect();

    console.log("Point coordinates: " + [x, y]);

    x = ((x - rect.left) - canvas.width/2) / (canvas.width/2);
    y = (canvas.height/2 - (y - rect.top)) / (canvas.height/2);

    return ([x, y]);
}

function renderAllShapes() {
    gl.clear(gl.COLOR_BUFFER_BIT); // Clear canvas

    let len = g_shapesList.length;
    for (let i=0; i < len; i++) {
        g_shapesList[i].render();
    }
}

function addActionsForHtmlUI() {
    // Button Events
    document.getElementById("clear").onclick = function() { g_shapesList = []; renderAllShapes(); };
    document.getElementById("square").onclick = function() { g_selectedType = POINT; sendTextToHTML("Drawing Mode: Squares", "drawingMode"); };
    document.getElementById("triangle").onclick = function() { g_selectedType = TRIANGLE; sendTextToHTML("Drawing Mode: Triangles", "drawingMode"); };
    document.getElementById("circle").onclick = function() { g_selectedType = CIRCLE; sendTextToHTML("Drawing Mode: Circles", "drawingMode"); };
    document.getElementById("demo").addEventListener('mouseup', function(){ renderDemo() } )

    // Slider events
    document.getElementById("redSlider").addEventListener('mouseup', function(){ shapeColor[0] = this.value/100; });
    document.getElementById("greenSlider").addEventListener('mouseup', function(){ shapeColor[1] = this.value/100; });
    document.getElementById("blueSlider").addEventListener('mouseup', function(){ shapeColor[2] = this.value/100; });

    document.getElementById("sizeSlider").addEventListener('mouseup', function(){ shapeSize = this.value; });
    document.getElementById("segmentSlider").addEventListener('mouseup', function(){ segmentCount = this.value; });
}

function sendTextToHTML(text, htmlID) {
    var htmlElm = document.getElementById(htmlID);
    if (!htmlID) {
        console.log("Failed to get " + htmlID + " from HTML.");
        return false;
    }
    htmlElm.innerHTML = text;
}

function main() {
    setupWebGL();
    connectVariablesToGLSL();
    addActionsForHtmlUI();
    canvas.onmousedown = click; // Register function to be called on mouse click
    canvas.onmousemove = function(ev) { if (ev.buttons == 1) { click(ev) } };

    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Specify color for clearing the canvas
    gl.clear(gl.COLOR_BUFFER_BIT); // Clear canvas
}