class Rainbow {
    constructor(position=[0.0, 0.0, 0.0], prevPosition=[0.0, 0.0], size=5.0) {
        this.type="rainbow";
        this.position = position;
        this.color = rainbowColorArray[rainbowColorIndex]; // Calculate rainbow color based on color index
        this.prevPosition = prevPosition;
        this.size = size;

        currentColorFrequency += 1;

        if (currentColorFrequency >= maxColorFrequency) {
            currentColorFrequency = 0;
            rainbowColorIndex += 1;

            if (rainbowColorIndex >= rainbowColorArray.length) {
                rainbowColorIndex = 0;
            }
        }
    }

    render() {
        let xy = this.position;
        let rgba = this.color; 
        let size = this.size;

        // Draw point
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