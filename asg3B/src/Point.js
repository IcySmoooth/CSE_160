class Point {
    constructor(position=[0.0, 0.0, 0.0], color=[1.0, 1.0, 1.0, 1.0], size=5.0) {
        this.type = 'point';
        this.position = position;
        this.color = color;
        this.size = size
    }

    render() {
        let xy = this.position;
        let rgba = this.color;
        let size = this.size;

        // Quit using the buffer to send the attribute
        gl.disableVertexAttribArray(a_Position);
        // Pass point's position to vertex shader
        gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
        // Pass point's color to fragment shader
        gl.uniform3f(u_Color, rgba[0], rgba[1], rgba[2], rgba[3]);
        // Pass point's size to vertex shader
        gl.uniform1f(u_Size, size);
        // Draw
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}