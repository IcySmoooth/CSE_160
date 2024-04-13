// Uses 4 points to construct 2 triangles. 
// The first and last coordinate must be set diagonal to each other.
// Ex. For a square with points (0, 0), (0, 1), (1, 0), (1, 1)
// If (0, 0) is at index 0, (1, 1) must be in index 3 as that's the point not adjacent to it.
class ExactSquare {
    constructor(points=[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], color=[1.0, 1.0, 1.0, 1.0], size=5.0) {
        this.type="eSquare";

        // convert world coords into local GL coords
        this.point1 = convertCoordinatesToGL([ points[0], points[1] ]);
        this.point2 = convertCoordinatesToGL([ points[2], points[3] ]);
        this.point3 = convertCoordinatesToGL([ points[4], points[5] ]);
        this.point4 = convertCoordinatesToGL([ points[6], points[7] ]);
        this.color= color;
        this.size = size;
    }

    render() {
        let pt1 = this.point1;
        let pt2 = this.point2;
        let pt3 = this.point3;
        let pt4 = this.point4;
        let rgba = this.color;
        let size = this.size;

        // Pass point's color to fragment shader
        gl.uniform3f(u_Color, rgba[0], rgba[1], rgba[2], rgba[3]);
        // Pass point's size to vertex shader
        //gl.uniform1f(u_Size, size);

        // Draw triangle 1
        drawTriangle( [pt1[0], pt1[1], pt2[0], pt2[1], pt4[0], pt4[1]] );

        // Draw triangle 2
        drawTriangle( [pt1[0], pt1[1], pt3[0], pt3[1], pt4[0], pt4[1]] );
    }
}
