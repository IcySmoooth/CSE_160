class Cube {
    constructor() {
        this.type = 'cube';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
    }

    render() {
        var rgba = this.color;

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // Front face
        drawTriangle3D( [0,0,0, 1,1,0, 1,0,0] );
        drawTriangle3D( [0,0,0, 0,1,0, 1,1,0] );

        // Pass the color of a point to u_FragColor uniform variable
        gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);

        // Top face
        drawTriangle3D( [0,1,0, 0,1,1, 1,1,1] );
        drawTriangle3D( [0,1,0, 1,1,1, 1,1,0] );

        // Left face
        drawTriangle3D( [0,0,0, 0,0,1, 0,1,1] );
        drawTriangle3D( [0,0,0, 0,1,1, 0,1,0] );

        // Right face
        drawTriangle3D( [1,0,0, 1,0,1, 1,1,1] );
        drawTriangle3D( [1,0,0, 1,1,1, 1,1,0] );

        // Back face
        drawTriangle3D( [0,0,1, 0,1,1, 1,1,1] );
        drawTriangle3D( [0,0,1, 1,0,1, 1,1,1] );

        // Bottom Face
        drawTriangle3D( [0,0,0, 0,0,1, 1,0,1] );
        drawTriangle3D( [0,0,0, 1,0,0, 1,0,1] );
    }
}