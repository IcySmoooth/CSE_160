// Instead of building a tringle from a center point, ExactTriangle builds a triangle from a set of three points
class ExactTriangle {
    constructor(points=[0.0, 0.0, 0.0, 0.0, 0.0, 0.0], color=[1.0, 1.0, 1.0, 1.0], size=5.0) {
        this.type="eTriangle";

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
        drawTriangle( [pt1[0], pt1[1], pt2[0], pt2[1], pt3[0], pt3[1]] );
    }
}

function convertCoordinatesToGL(coords) {
    let rect = canvas.getBoundingClientRect();
    let x = coords[0] + rect.left; // Align global coordinates to coordinate on webpage
    let y = coords[1] + rect.top; // Align global coordinates to coordinate on webpage

    x = ((x - rect.left) - canvas.width/2) / (canvas.width/2);
    y = (canvas.height/2 - (y - rect.top)) / (canvas.height/2);

    return ([x, y]);
}
