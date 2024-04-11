// DrawTriangle.js (c) 2012 matsuda
function main() {  
  // Retrieve <canvas> element
  canvas = document.getElementById('cnv1');  
  if (!canvas) { 
    console.log('Failed to retrieve the <canvas> element');
    return false; 
  } 

  // Get the rendering context for 2DCG
  ctx = canvas.getContext('2d');

  // Draw a black rectangle
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set color to black
  ctx.fillRect(0, 0, canvas.width, canvas.height);        // Fill a rectangle with the color
}

function drawVector(v, color) {
  ctx.strokeStyle = color;

  // Get coordinates of the vector
  let x = v.elements[0] * 20;
  let y = v.elements[1] * 20;

  // Get midpoint of canvas
  let cx = canvas.width/2;
  let cy = canvas.height/2;

  // Draw vector
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + x, cy - y);
  ctx.stroke();
}

function angleBetween(v1, v2) {
  let cosAngle = Math.acos(Vector3.dot(v1, v2) / (v1.magnitude() * v2.magnitude())); // Find theta
  return cosAngle * (180 / Math.PI); // convert from radians to degrees
}

function areaTriangle(v1, v2) {
  let crossProduct = Vector3.cross(v1, v2);
  return crossProduct.magnitude() / 2;
}

function handleDrawEvent() {
  let v1x = document.getElementById("xin1").value;
  let v1y = document.getElementById("yin1").value;
  let v2x = document.getElementById("xin2").value;
  let v2y = document.getElementById("yin2").value;
  
  // Create vector3 points
  let v1 = new Vector3([v1x, v1y, 0]);
  let v2 = new Vector3([v2x, v2y, 0]);

  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  // Draw a black rectangle
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set color to black
  ctx.fillRect(0, 0, canvas.width, canvas.height);        // Fill a rectangle with the color

  drawVector(v1, "red"); // Draw vectors
  drawVector(v2, "blue");
}

function handleDrawOperationEvent() {
  let v1x = document.getElementById("xin1").value;
  let v1y = document.getElementById("yin1").value;
  let v2x = document.getElementById("xin2").value;
  let v2y = document.getElementById("yin2").value;
  
  // Create vector3 points
  let v1 = new Vector3([v1x, v1y, 0]);
  let v2 = new Vector3([v2x, v2y, 0]);

  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  // Draw a black rectangle
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set color to black
  ctx.fillRect(0, 0, canvas.width, canvas.height);        // Fill a rectangle with the color

  drawVector(v1, "red"); // Draw vectors
  drawVector(v2, "blue");

  let operation = document.getElementById("operation-select").value;
  let scalar = document.getElementById("scalar").value;

  let v3 = v1;
  let v4 = v2;
  switch (operation) {
    case "add":
      v3.add(v4);
      drawVector(v3, "green");
      break;
    case "sub":
      v3.sub(v4);
      drawVector(v3, "green");
      break;
    case "mul":
      v3.mul(scalar);
      v4.mul(scalar);
      drawVector(v3, "green");
      drawVector(v4, "green");
      break;
    case "div":
      v3.div(scalar);
      v4.div(scalar);
      drawVector(v3, "green");
      drawVector(v4, "green");
      break;
    case "ang":
      console.log("Angle: ", angleBetween(v1, v2));
      break;
    case "are":
      console.log("Area of the triangle: ", areaTriangle(v3, v4));
      break;
    case "mag":
      console.log("Magnitude v1: ", v3.magnitude());
      console.log("Magnitude v2: ", v4.magnitude());
      break;
    case "nor":
      drawVector(v3.normalize(), "green");
      drawVector(v4.normalize(), "green");
      break; 
    default:
      return;
  }
}
