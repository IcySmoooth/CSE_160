// Instead of building a tringle from a center point, ExactTriangle builds a triangle from a set of three points
class ExactTriangle {
    constructor(points=[0.0, 0.0, 0.0, 0.0, 0.0, 0.0], color=[1.0, 1.0, 1.0, 1.0], size=5.0) {
        this.type="triangle";

        // convert world coords into local GL coords
        this.point1 = convertCoordinatesToGL([ points[0], points[1] ]);
        this.point2 = convertCoordinatesToGL([ points[2], points[3] ]);
        this.point3 = convertCoordinatesToGL([ points[4], points[5] ]);
        this.color= color;
        this.size = size;
    }

    render() {
        let pt1 = this.point1;
        let pt2 = this.point2;
        let pt3 = this.point3;
        let rgba = this.color;
        let size = this.size;

        // Pass point's color to fragment shader
        gl.uniform3f(u_Color, rgba[0], rgba[1], rgba[2], rgba[3]);
        // Pass point's size to vertex shader
        //gl.uniform1f(u_Size, size);
        // Draw
        drawTriangle( pt1[0], pt1[1], pt2[0], pt2[1], pt3[0], pt3[1] );
    }
}

function convertCoordinatesToGL(coords) {
    let x = coords[0]; // X coordinate
    let y = coords[1]; // Y coordinate
    let rect = canvas.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width/2) / (canvas.width/2);
    y = (canvas.height/2 - (y - rect.top)) / (canvas.height/2);

    return ([x, y]);
}
/*
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
} */