class Circle {
    constructor(position=[0.0, 0.0, 0.0], color=[1.0, 1.0, 1.0, 1.0], size=5.0, segments=3) {
        this.type="circle";
        this.position = position;
        this.color = color;
        this.size = size;
        this.segments = segments;
    }

    render() {
        let xy = this.position;
        let rgba = this.color;
        let size = this.size;

        // Pass point's color to fragment shader
        gl.uniform3f(u_Color, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Pass point's size to vertex shader
        gl.uniform1f(u_Size, size);

        // Draw
        var d = this.size/200.0;

        let angleStep=360/this.segments;
        for (var angle=0; angle < 360; angle=angle+angleStep) {
            let centerPt = [xy[0], xy[1]];
            let angle1 = angle;
            let angle2 = angle+angleStep;
            let vec1 = [Math.cos(angle1*Math.PI/180)*d, Math.sin(angle1*Math.PI/180)*d];
            let vec2 = [Math.cos(angle2*Math.PI/180)*d, Math.sin(angle2*Math.PI/180)*d];
            let pt1 = [centerPt[0]+vec1[0], centerPt[1]+vec1[1]];
            let pt2 = [centerPt[0]+vec2[0], centerPt[1]+vec2[1]];

            drawTriangle( [xy[0], xy[1], pt1[0], pt1[1], pt2[0], pt2[1]] );
        }
    }
}