class Cube {
    constructor() {
        this.type = 'cube';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.textureNum = -1;
    }

    render() {
        var rgba = this.color;

        gl.uniform1i(u_WhichTexture, this.textureNum);

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // Front face
        //drawTriangle3DUV( [0,0,0, 1,1,0, 1,0,0], [0,0, 1,1, 1,0] );
        //drawTriangle3DUV( [0,0,0, 0,1,0, 1,1,0], [0,0, 0,1, 1,1] );
        drawTriangle3DUV( [0,1,1, 0,0,1, 1,0,1], [0,0, 0,1, 1,1] );
        drawTriangle3DUV( [0,1,1, 1,0,1, 1,1,1], [0,0, 1,1, 1,0] );

        // Pass the color of a point to u_FragColor uniform variable
        gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);

        // Top face
        //drawTriangle3DUV( [1,1,1, 0,1,0, 0,1,1], [0,0, 1,1, 1,0] );
        //drawTriangle3DUV( [1,1,1, 1,1,0, 0,1,0], [0,0, 0,1, 1,1] );
        drawTriangle3DUV( [0,1,0, 0,1,1, 1,1,1], [0,0, 0,1, 1,1] );
        drawTriangle3DUV( [0,1,0, 1,1,1, 1,1,0], [0,0, 1,1, 1,0] );

        gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]);

        // Left face
        //drawTriangle3DUV( [0,0,0, 0,1,1, 0,0,1], [1,0, 0,1, 0,0] );
        //drawTriangle3DUV( [0,0,0, 0,1,0, 0,1,1], [1,0, 1,1, 0,1] );
        drawTriangle3DUV( [0,1,0, 0,0,0, 0,0,1], [0,0, 0,1, 1,1] );
        drawTriangle3DUV( [0,1,0, 0,0,1, 0,1,1], [0,0, 1,1, 1,0] );

        gl.uniform4f(u_FragColor, rgba[0]*.7, rgba[1]*.7, rgba[2]*.7, rgba[3]);

        // Right face
        //drawTriangle3DUV( [1,0,0, 1,1,1, 1,0,1], [1,0, 0,1, 0,0] );
        //drawTriangle3DUV( [1,0,0, 1,1,0, 1,1,1], [1,0, 1,1, 0,1] );
        drawTriangle3DUV( [1,1,1, 1,0,1, 1,0,0], [0,0, 0,1, 1,1] );
        drawTriangle3DUV( [1,1,1, 1,0,0, 1,1,0], [0,0, 1,1, 1,0] );

        gl.uniform4f(u_FragColor, rgba[0]*.6, rgba[1]*.6, rgba[2]*.6, rgba[3]);

        // Back face
        //drawTriangle3DUV( [0,0,1, 0,1,1, 1,1,1], [0,0, 0,1, 1,1] );
        //drawTriangle3DUV( [0,0,1, 1,0,1, 1,1,1], [0,0, 1,0, 1,1] );
        drawTriangle3DUV( [1,1,0, 1,0,0, 0,0,0], [0,0, 0,1, 1,1] );
        drawTriangle3DUV( [1,1,0, 0,0,0, 0,1,0], [0,0, 1,1, 1,0] );

        gl.uniform4f(u_FragColor, rgba[0]*.5, rgba[1]*.5, rgba[2]*.5, rgba[3]);

        // Bottom Face
        //drawTriangle3DUV( [1,0,1, 0,0,0, 0,0,1], [0,0, 1,1, 1,0] );
        //drawTriangle3DUV( [1,0,1, 1,0,0, 0,0,0], [0,0, 0,1, 1,1] );
        drawTriangle3DUV( [0,0,1, 0,0,0, 1,0,0], [0,0, 0,1, 1,1] );
        drawTriangle3DUV( [0,0,1, 1,0,0, 1,0,1], [0,0, 1,1, 1,0] );
    }

    renderfast() {
        var rgba = this.color;

        gl.uniform1i(u_WhichTexture, this.textureNum);
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        var vertices = [];
        var uv = [];

        // cube's back
        vertices = vertices.concat([0,0,0, 1,0,0, 1,1,0]);
        uv = uv.concat([0,0, 1,0, 1,1]);
        vertices = vertices.concat([0,0,0, 0,1,0, 1,1,0]);
        uv = uv.concat([0,0, 0,1, 1,1]);

        // Define the cube's front
        vertices = vertices.concat([1,0,1, 0,0,1, 0,1,1]);
        uv = uv.concat([0,0, 1,0, 1,1]);
        vertices = vertices.concat([1,0,1, 1,1,1, 0,1,1]);
        uv = uv.concat([0,0, 0,1, 1,1]);

        // Define the cube's top
        vertices = vertices.concat([0,1,0, 0,1,1, 1,1,1]);
        uv = uv.concat([0,0, 0,1, 1,1]);
        vertices = vertices.concat([0,1,0, 1,1,0, 1,1,1]);
        uv = uv.concat([0,0, 1,0, 1,1]);

        // Define the cube's bottom
        vertices = vertices.concat([0,0,1, 0,0,0, 1,0,0]);
        uv = uv.concat([0,0, 0,1, 1,1]);
        vertices = vertices.concat([0,0,1, 1,0,1, 1,0,0]);
        uv = uv.concat([0,0, 1,0, 1,1]);

        // Define the cube's sides
        vertices = vertices.concat([0,0,1, 0,0,0, 0,1,0]);
        uv = uv.concat([0,0, 1,0, 1,1]);
        vertices = vertices.concat([0,0,1, 0,1,1, 0,1,0]);
        uv = uv.concat([0,0, 0,1, 1,1]);

        vertices = vertices.concat([1,0,0, 1,0,1, 1,1,1]);
        uv = uv.concat([0,0, 1,0, 1,1]);
        vertices = vertices.concat([1,0,0, 1,1,0, 1,1,1]);
        uv = uv.concat([0,0, 0,1, 1,1]);

        //var allVerts = [];
        //var allUV = [];
        // Front of cube
        //allVerts = allVerts.concat( [0,0,0, 1,1,0, 1,0,0, 0,0,0, 0,1,0, 1,1,0] );
        //allVerts = allVerts.concat( [0,0,0, 1,1,0, 1,0,0] );
        //allVerts = allVerts.concat( [0,0,0, 0,1,0, 1,1,0] );

        // top of cube
        //allVerts = allVerts.concat( [0,1,0, 0,1,1, 1,1,1] );
        //allVerts = allVerts.concat( [0,1,0, 1,1,1, 1,1,0] );

        // right of cube
        //allVerts = allVerts.concat( [1,1,0, 1,1,1, 1,0,0] );
        //allVerts = allVerts.concat( [1,0,0, 1,1,1, 1,0,1] );

        // left of cube
        //allVerts = allVerts.concat( [0,1,0, 0,1,1, 0,0,0] );
        //allVerts = allVerts.concat( [0,0,0, 0,1,1, 0,0,1] );

        // bottom of cube
        //allVerts = allVerts.concat( [0,0,0, 0,0,1, 1,0,1] );
        //allVerts = allVerts.concat( [0,0,0, 1,0,1, 1,0,0] );

        // back of cube
        //allVerts = allVerts.concat( [0,0,1, 1,1,1, 1,0,1] );
        //allVerts = allVerts.concat( [0,0,1, 0,1,1, 1,1,1] );

        //console.log(new Float32Array(allVerts));
        drawTriangle3D(vertices, uv);
    }

    renderGivenVertices(vertices, uv) {
        var rgba = this.color;
        gl.uniform1i(u_WhichTexture, this.textureNum);
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        
        drawTriangle3D(vertices, uv);
    }
}


function generateVertices() {
    var vertices = [];

    // cube's back
    vertices = vertices.concat([0,0,0, 1,0,0, 1,1,0]);
    vertices = vertices.concat([0,0,0, 0,1,0, 1,1,0]);

    // Define the cube's front
    vertices = vertices.concat([1,0,1, 0,0,1, 0,1,1]);
    vertices = vertices.concat([1,0,1, 1,1,1, 0,1,1]);

    // Define the cube's top
    vertices = vertices.concat([0,1,0, 0,1,1, 1,1,1]);
    vertices = vertices.concat([0,1,0, 1,1,0, 1,1,1]);

    // Define the cube's bottom
    vertices = vertices.concat([0,0,1, 0,0,0, 1,0,0]);
    vertices = vertices.concat([0,0,1, 1,0,1, 1,0,0]);

    // Define the cube's sides
    vertices = vertices.concat([0,0,1, 0,0,0, 0,1,0]);
    vertices = vertices.concat([0,0,1, 0,1,1, 0,1,0]);

    vertices = vertices.concat([1,0,0, 1,0,1, 1,1,1]);
    vertices = vertices.concat([1,0,0, 1,1,0, 1,1,1]);

    return vertices;
}

function generateUV() {
    var uv = [];

    // cube's back
    uv = uv.concat([0,0, 1,0, 1,1]);
    uv = uv.concat([0,0, 0,1, 1,1]);

    // Define the cube's front
    uv = uv.concat([0,0, 1,0, 1,1]);
    uv = uv.concat([0,0, 0,1, 1,1]);

    // Define the cube's top
    uv = uv.concat([0,0, 0,1, 1,1]);
    uv = uv.concat([0,0, 1,0, 1,1]);

    // Define the cube's bottom
    uv = uv.concat([0,0, 0,1, 1,1]);
    uv = uv.concat([0,0, 1,0, 1,1]);

    // Define the cube's sides
    uv = uv.concat([0,0, 1,0, 1,1]);
    uv = uv.concat([0,0, 0,1, 1,1]);

    uv = uv.concat([0,0, 1,0, 1,1]);
    uv = uv.concat([0,0, 0,1, 1,1]);

    return uv;
}