class Triangle {
    constructor() {
        this.type="triangle";
        this.position=[0.0, 0.0, 0.0];
        this.color=[1.0, 1.0, 1.0, 1.0];
        this.size = 5.0;
    }

    render() {
        let xy = this.position;
        let rgba = this.color;
        let size = this.size;

        // Pass point's color to fragment shader
        gl.uniform3f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        // Pass point's size to vertex shader
        gl.uniform1f(u_Size, size);
        // Draw
        var d = this.size/200.0;
        drawTriangle( [xy[0], xy[1], xy[0] + d, xy[1], xy[0]+d/2, xy[1] + d] );
    }
}

function drawTriangle(vertices) {
    var n = 3; // Number of vertices

    // Create buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log("Failed to create buffer object.");
        return false;
    }

    // Bind buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write data into buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    // Assign the buffer object to a_Position
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position
    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.TRIANGLES,  0, n);
}

function drawTriangle3D(vertices) {
    var n = 3; // Number of vertices

    // Create buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log("Failed to create buffer object.");
        return false;
    }

    // Bind buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write data into buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    // Assign the buffer object to a_Position
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position
    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.TRIANGLES,  0, n);
}

function drawTriangle3DUV(vertices, uv) {
    var n = 3; // Number of vertices

    // Create buffer object for positions
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log("Failed to create buffer object.");
        return false;
    }

    // Bind buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write data into buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    // Assign the buffer object to a_Position
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position
    gl.enableVertexAttribArray(a_Position);


    // Create buffer object for UV
    var uvBuffer = gl.createBuffer();
    if (!uvBuffer) {
        console.log("Failed to create buffer object.");
        return false;
    }

    // Bind buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    // Write data into buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);

    // Assign the buffer object to a_UV
    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_UV
    gl.enableVertexAttribArray(a_UV);

    gl.drawArrays(gl.TRIANGLES,  0, n);
}