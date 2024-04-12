function renderDemo() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    g_shapesList = [];

    // Assign color palette
    let white = [1.0, 1.0, 1.0, 1.0];
    let black = [0.0, 0.0, 0.0, 1.0];
    let pink = [0.969, 0.6, 0.925, 1.0];
    let red = [0.949, 0.314, 0.267, 1.0];
    let light_green = [0.459, 0.792, 0.427, 1.0];
    let dark_green = [0.286, 0.655, 0.212, 1.0];
    let light_blue = [0.333, 0.894, 0.941, 1.0];
    let dark_blue = [0.239, 0.506, 0.871, 1.0];
    let yellow = [0.976, 0.839, 0.325, 1.0];
    let orange = [0.953, 0.467, 0.247, 1.0];

    // Assign common positions
    let midpoint = [canvas.width/2, canvas.height/2];
    let topLeft = [0.0, 0.0];
    let bottomLeft = [0.0, canvas.height];
    let topRight = [canvas.width, 0.0];
    let bottomRight = [canvas.width, canvas.height];

    g_shapesList.push(new ExactTriangle([0.0, 0.0, 0.0, canvas.height, canvas.width, canvas.height], white, 5)); 

    // Render all shapes
    let len = g_shapesList.length;
    for (let i=0; i < len; i++) {
        g_shapesList[i].render();
    }
}