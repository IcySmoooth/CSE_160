function addBackgroundElements() {
    // Create Background (preserve a black border 10px big)
    g_shapesList.push(new ExactSquare(
        [border, border, 
        border, canvas.height - border, 
        canvas.width - border, border,
        canvas.width - border, canvas.height - border], white, 5)); 
    
    // Create floor level
    g_shapesList.push(new ExactSquare(
        [border, 300.0,
        canvas.width - border, 300.0,
        border, canvas.height - border,
        canvas.width - border, canvas.height - border], light_green, 5));
    
    // Create floor outline
    g_shapesList.push(new ExactSquare(
        [border, 300.0,
        canvas.width - border, 300.0,
        border, 303.0,
        canvas.width - border, 303.0], black, 5));
}

function addPillarElements() {
    // Create background pillar 1
    g_shapesList.push(new ExactSquare(
        [70.0, 130.0, 
        130.0, 130.0,
        70.0, 300.0,
        130.0, 300.0], yellow, 5));
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [100, 130] ), yellow, 30, 17));
    g_shapesList.push(new ExactSquare(
        [75.0, 130.0, 
        125.0, 130.0,
        75.0, 300.0,
        125.0, 300.0], white, 5));
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [100, 130] ), white, 25, 17));
    g_shapesList.push(new ExactSquare(
        [80.0, 130.0, 
        120.0, 130.0,
        80.0, 300.0,
        120.0, 300.0], yellow, 5));
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [100, 130] ), yellow, 20, 17));
    g_shapesList.push(new ExactSquare(
        [85.0, 130.0, 
        115.0, 130.0,
        85.0, 300.0,
        115.0, 300.0], white, 5));
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [100, 130] ), white, 15, 17));

    // Create background pillar 2
    g_shapesList.push(new ExactSquare(
        [100.0, 185.0, 
        160.0, 185.0,
        100.0, 300.0,
        160.0, 300.0], yellow, 5));
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [130, 185] ), yellow, 30, 17));
    g_shapesList.push(new ExactSquare(
        [105.0, 185.0, 
        155.0, 185.0,
        105.0, 300.0,
        155.0, 300.0], white, 5));
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [130, 185] ), white, 25, 17));
    g_shapesList.push(new ExactSquare(
        [110.0, 185.0, 
        150.0, 185.0,
        110.0, 300.0,
        150.0, 300.0], yellow, 5));
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [130, 185] ), yellow, 20, 17));
    g_shapesList.push(new ExactSquare(
        [115.0, 185.0, 
        145.0, 185.0,
        115.0, 300.0,
        145.0, 300.0], white, 5));
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [130, 185] ), white, 15, 17));
    
    // Create background pillar 3
    g_shapesList.push(new ExactSquare(
        [40.0, 230.0, 
        100.0, 230.0,
        40.0, 300.0,
        100.0, 300.0], yellow, 5));
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [70, 230] ), yellow, 30, 17));
    g_shapesList.push(new ExactSquare(
        [45.0, 230.0, 
        95.0, 230.0,
        45.0, 300.0,
        95.0, 300.0], white, 5));
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [70, 230] ), white, 25, 17));
    g_shapesList.push(new ExactSquare(
        [50.0, 230.0, 
        90.0, 230.0,
        50.0, 300.0,
        90.0, 300.0], yellow, 5));
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [70, 230] ), yellow, 20, 17));
    g_shapesList.push(new ExactSquare(
        [55.0, 230.0, 
        85.0, 230.0,
        55.0, 300.0,
        85.0, 300.0], white, 5));
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [70, 230] ), white, 15, 17));
}

function addClouds() {
    // Cloud 1
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [50, 50] ), dark_blue, 30, 25));
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [85, 50] ), dark_blue, 30, 25));
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [120, 50] ), dark_blue, 30, 25));
    
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [50, 50] ), light_blue, 28, 25));
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [85, 50] ), light_blue, 28, 25));
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [120, 50] ), light_blue, 28, 25));
    
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [50, 50] ), white, 26, 25));
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [85, 50] ), white, 26, 25));
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [120, 50] ), white, 26, 25));
    
    // Cloud 2
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [270, 90] ), dark_blue, 20, 25));
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [290, 90] ), dark_blue, 20, 25));
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [310, 90] ), dark_blue, 20, 25));
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [330, 90] ), dark_blue, 13, 25));
    
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [270, 90] ), light_blue, 18, 25));
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [290, 90] ), light_blue, 18, 25));
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [310, 90] ), light_blue, 18, 25));
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [330, 90] ), light_blue, 11, 25));
    
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [270, 90] ), white, 16, 25));
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [290, 90] ), white, 16, 25));
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [310, 90] ), white, 16, 25));
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [330, 90] ), white, 9, 25));
}

function addGrass() {
    g_shapesList.push(new ExactTriangle(
        [160, 300.0,
        175, 280.0,
        175, 300], light_green, 5));
    g_shapesList.push(new ExactTriangle(
        [170, 300.0,
        185, 280.0,
        185, 300], light_green, 5));
    g_shapesList.push(new ExactTriangle(
        [180, 300.0,
        195, 280.0,
        195, 300], light_green, 5));
    
    g_shapesList.push(new ExactTriangle(
        [20.0, 300.0,
        35.0, 280.0,
        35.0, 300.0], light_green, 5));
    
    g_shapesList.push(new ExactTriangle(
        [10.0, 300.0,
        25.0, 280.0,
        25.0, 300.0], light_green, 5));
    
    g_shapesList.push(new ExactTriangle(
        [330, 300.0,
        345, 280.0,
        345, 300], light_green, 5));
    g_shapesList.push(new ExactTriangle(
        [340, 300.0,
        355, 280.0,
        355, 300], light_green, 5));
    g_shapesList.push(new ExactTriangle(
        [350, 300.0,
        365, 280.0,
        365, 300], light_green, 5));
}

function addKirby() {
    // Right foot
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [225, 287] ), black, 15, 25)); // heel outline
     g_shapesList.push(new ExactSquare(
        [225.0, 272.0, 
        250.0, 272.0,
        225.0, 300.0,
        250.0, 300.0], black, 5)); // middle outline
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [250, 287] ), black, 15, 25)); // toe outline
    
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [225, 287] ), red, 13, 25)); // heel
     g_shapesList.push(new ExactSquare(
        [225.0, 274.0, 
        250.0, 274.0,
        225.0, 300.0,
        250.0, 300.0], red, 5)); // middle
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [250, 287] ), red, 13, 25)); // toe
    
    // Left foot
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [175, 287] ), black, 15, 25)); // heel outline
     g_shapesList.push(new ExactSquare(
        [175.0, 272.0, 
        150.0, 272.0,
        175.0, 300.0,
        150.0, 300.0], black, 5)); // middle outline
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [150, 287] ), black, 15, 25)); // toe outline
    
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [175, 287] ), red, 13, 25)); // heel
     g_shapesList.push(new ExactSquare(
        [170.0, 274.0, 
        150.0, 274.0,
        170.0, 300.0,
        150.0, 300.0], red, 5)); // middle
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [150, 287] ), red, 13, 25)); // toe
    
    // Left Hand
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [260, 220] ), black, 20, 25));
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [260, 220] ), pink, 18, 25));
    
    // Right Hand
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [140, 220] ), black, 20, 25));
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [140, 220] ), pink, 18, 25));

    // Kirby Body
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [200, 240] ), black, 50, 25));
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [200, 240] ), pink, 48, 25));

    // Kirby Left Eye
    g_shapesList.push(new ExactSquare(
        [190.0, 220.0,
        190.0, 235.0,
        180.0, 220.0,
        180.0, 235.0], black, 5));
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [185, 222] ), black, 5, 25));
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [185, 237] ), black, 5, 25));
    g_shapesList.push(new Point( convertCoordinatesToGL( [185, 222] ), white, 5 ));
    
    g_shapesList.push(new ExactSquare(
        [210.0, 220.0,
        210.0, 235.0,
        220.0, 220.0,
        220.0, 235.0], black, 5));
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [215, 222] ), black, 5, 25));
    g_shapesList.push(new Circle(
        convertCoordinatesToGL( [215, 237] ), black, 5, 25));
    g_shapesList.push(new Point( convertCoordinatesToGL( [215, 222] ), white, 5 ));
    
    // Kirby mouth
    g_shapesList.push(new ExactTriangle(
        [185.0, 255.0,
        215.0, 255.0,
        200.0, 270.0], black, 5));
    
    // Kirby Blush
    g_shapesList.push(new ExactSquare(
        [160, 245,
        175, 245,
        160, 250,
        175, 250], hot_pink, 5));
    g_shapesList.push(new ExactSquare(
        [240, 245,
        225, 245,
        240, 250,
        225, 250], hot_pink, 5));
}

function renderDemo() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    g_shapesList = [];

    // Assign color palette
    white = [1.0, 1.0, 1.0, 1.0];
    black = [0.0, 0.0, 0.0, 1.0];
    pink = [0.969, 0.6, 0.925, 1.0];
    hot_pink = [0.882, 0.400, 0.502];
    red = [0.949, 0.314, 0.267, 1.0];
    light_green = [0.459, 0.792, 0.427, 1.0];
    dark_green = [0.286, 0.655, 0.212, 1.0];
    light_blue = [0.333, 0.894, 0.941, 1.0];
    dark_blue = [0.239, 0.506, 0.871, 1.0];
    yellow = [0.976, 0.839, 0.325, 1.0];
    orange = [0.953, 0.467, 0.247, 1.0];

    border = 10;

    addBackgroundElements();
    addPillarElements();
    addClouds();
    addGrass();
    addKirby();
    
    // Render all shapes
    let len = g_shapesList.length;
    for (let i=0; i < len; i++) {
        g_shapesList[i].render();
    }
}