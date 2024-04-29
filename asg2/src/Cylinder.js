class Cylinder {
    constructor() {
        this.type = 'cylinder';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.segments = 6;
        this.matrix = new Matrix4();
    }

    render() {
        var rgba = this.color;

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        var d = .025;

        var tCenterPt = [0.5, 0.0, 0.5];
        var bCenterPt = [0.5, 1.0, 0.5];

        let angleStep=360/this.segments;
        console.log(angleStep);
        for (var angle=0; angle < 360; angle=angle+angleStep) {
            // Draw top face triangle
            let angle1 = angle;
            let angle2 = angle+angleStep;

            // Find 
            let vec1 = [Math.cos(angle1*Math.PI/180)*d, 0, Math.sin(angle1*Math.PI/180)*d];
            let vec2 = [Math.cos(angle2*Math.PI/180)*d, 0, Math.sin(angle2*Math.PI/180)*d];

            // Find points for top face of cylinder
            let tPt1 = [tCenterPt[0]+vec1[0], tCenterPt[1], tCenterPt[2]+vec1[2]];
            let tPt2 = [tCenterPt[0]+vec2[0], tCenterPt[1], tCenterPt[2]+vec2[2]];

            console.log("Top point 1: ", tPt1);
            console.log("Top point 2: ", tPt2);

            // Find points for bottom face of cylinder
            let bPt1 = [bCenterPt[0]+vec1[0], bCenterPt[1], bCenterPt[2]+vec1[2]];
            let bPt2 = [bCenterPt[0]+vec2[0], bCenterPt[1], bCenterPt[2]+vec2[2]];

            // Draw triangles for top face and bottom face respectively
            drawTriangle([ tPt1[0],tPt1[1],tPt1[2], tCenterPt[0],tCenterPt[1],tCenterPt[2], tPt2[0],tPt2[1],tPt2[2] ]);
            drawTriangle([ bPt1[0],bPt1[1],bPt1[2], bCenterPt[0],bCenterPt[1],bCenterPt[2], bPt2[0],bPt2[1],bPt2[2] ]);

            // Connect the two faces together
            //drawTriangle([ tPt1[0],tPt1[1],tPt1[2], bPt1[0],bPt1[1],bPt1[2], bPt2[0],bPt2[1],bPt2[2] ]);
            //drawTriangle([ tPt1[0],tPt1[1],tPt1[2], tPt2[0],tPt2[1],tPt2[2], bPt2[0],tPt2[1],tPt2[2] ]);
            drawTriangle([tPt1[0], tPt1[1], tPt1[2], tPt2[0], tPt2[1], tPt2[2], bPt1[0], bPt1[1], bPt1[2]]);
            drawTriangle([bPt1[0], bPt1[1], bPt1[2], tPt2[0], tPt2[1], tPt2[2], bPt2[0], bPt2[1], bPt2[2]]);
            break;
        }
        /*

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
        drawTriangle3D( [0,0,0, 1,0,0, 1,0,1] ); */
    }
}