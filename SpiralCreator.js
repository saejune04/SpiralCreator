//Variables that change how the spiral looks
let degreesRotated = 0;
let numAxis = 2;
let numNodes = 10;
let rotateSpd = 0.4;
let chaosFactor = 1;
let exactCoords = true;
let size = 400; //is the pixel length of half an axis

//Color variables
let maxColorSaturation = 255;

let r = maxColorSaturation;
let g = 0;
let b = 0;
let colorSpd = 1;

/*
Todo:
(done) make the canvas size equivalent to the variable size
(done)color saturation kinda wack when changing rip

add funcitonality to change the origin of the spiral to middle of screen?
(Done) add colors
(done) add variable refresh rate
add variable screen size scaling (reset stylesheet)
*/

//Handles all the sliders and buttons
//gotta make these more robust because if i set the initial vars to smth diff than whats initizliaed the slider shows the wrong value

//Size slider
let sizeSlider = document.getElementById('sizeSlider');
let sizeOutput = document.getElementById('sizeValue');
sizeOutput.innerHTML = sizeSlider.value;
sizeSlider.oninput = function() {
    sizeOutput.innerHTML = this.value;
    size = parseInt(this.value);
    
}
//Number of axis slider
let axisSlider = document.getElementById('axisSlider');
let axisOutput = document.getElementById('axisValue');
axisOutput.innerHTML = axisSlider.value;
axisSlider.oninput = function() {
    axisOutput.innerHTML = this.value;
    numAxis = parseInt(this.value);
    
}

//Number of nodes slider
let nodeSlider = document.getElementById('nodeSlider');
let nodeOutput = document.getElementById('nodeValue');
nodeOutput.innerHTML = nodeSlider.value;
nodeSlider.oninput = function() {
    nodeOutput.innerHTML = this.value;
    numNodes = parseInt(this.value);
}

//Rotation speed slider
let speedSlider = document.getElementById('brrrSlider');
let speedOutput = document.getElementById('brrrValue');
speedOutput.innerHTML = speedSlider.value;
speedSlider.oninput = function() {
    speedOutput.innerHTML = this.value;
    rotateSpd = parseFloat(this.value);
}

//Chaos factor slider
let chaosSlider = document.getElementById('chaosSlider');
let chaosOutput = document.getElementById('chaosValue');
chaosOutput.innerHTML = chaosSlider.value;
chaosSlider.oninput = function() {
    chaosOutput.innerHTML = this.value;
    chaosFactor = parseInt(this.value);
}

//Color speed slider
let colorSlider = document.getElementById('colorSlider');
let colorOutput = document.getElementById('colorValue');
colorOutput.innerHTML = colorSlider.value;
colorSlider.oninput = function() {
    colorOutput.innerHTML = this.value;
    colorSpd = parseInt(this.value);
}

//Color saturation slider
let satSlider = document.getElementById('satSlider');
let satOutput = document.getElementById('satValue');
satOutput.innerHTML = satSlider.value;
satSlider.oninput = function() {
    satOutput.innerHTML = this.value;
    maxColorSaturation = parseInt(this.value);
}

//Exact coords button
let ecbutton = document.getElementById('exactCoordsButton');
let ecoutput = document.getElementById('exactCoordsValue');
ecoutput.innerHTML = "on";
function changeECState() {
    if (exactCoords) {
        ecoutput.innerHTML = "off";
        exactCoords = false;
    } else {
        ecoutput.innerHTML = "on";

        exactCoords = true;

    }
}

//Starts the animation cycle
function init() {
    window.requestAnimationFrame(draw);
}
let times = [];
let fps = 60;

let start, previousTimeStamp = 0;
function draw(now) {
    //Sets up canvas
    const canvas = document.getElementById('drawingArea');
    const ctx = canvas.getContext("2d");
    ctx.canvas.height = size * 2;
    ctx.canvas.width = size * 2;
    //Color Handler
    ctx.strokeStyle = RGBToHex(r, g, b);
    calculateRGB();

    //Draw everything
    ctx.beginPath();
    drawAxis(ctx);
    drawCurvature(ctx);
    ctx.closePath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.stroke();

    times.unshift(now);
    if (times.length > 10) {
        var t0 = times.pop();
        fps = Math.floor(1000 * 10 / (now - t0));
        document.getElementById('fps').innerHTML = fps;
    }
    //Updates and refreshes canvas
    degreesRotated += rotateSpd / Math.max(1, fps) * 60;
    window.requestAnimationFrame(draw);
}

init();

//Draws the axis off the image
function drawAxis(ctx) {
    let tempx1 = size * Math.cos(degreesRotated * Math.PI / 180); //cos(0) = 1
    let tempy1 = size * Math.sin(degreesRotated * Math.PI / 180); //sin(0) = 0

    for (let i = 0; i < numAxis; i++) {
        //console.log("axis drawn: " + i + " from (" + (tempx1 + size) + "," + (tempy1 * -1 + size) + ") to (" + (size - tempx1) + "," + (size + tempy1) + ")");
        ctx.moveTo(tempx1 + size, tempy1 * -1 + size);
        ctx.lineTo(size - tempx1, size + tempy1);
        let tempx2 = tempx1;
        let tempy2 = tempy1;
        tempx1 = tempx2 * Math.cos(Math.PI / numAxis) - tempy2 * Math.sin(Math.PI / numAxis);
        tempy1 = tempx2 * Math.sin(Math.PI / numAxis) + tempy2 * Math.cos(Math.PI / numAxis);
    }
}

//Draws every line other than the axis in the image
function drawCurvature(ctx) {
    for (let i = 1; i <= numNodes + chaosFactor; i++) {

        let tempx1 = (numNodes - i + 1) * (size / numNodes) * Math.cos(degreesRotated * Math.PI / 180);
        let tempy1 = (numNodes - i + 1) * (size / numNodes) * Math.sin(degreesRotated * Math.PI / 180);
        let multiplierOnAxis = (numNodes - i + 1) / i;
        ctx.moveTo(size - tempx1, size + tempy1);
        for (let j = 0; j <= numAxis; j++) {
            let tempx2 = tempx1;
            let tempy2 = tempy1;
            tempx1 = (1 / multiplierOnAxis) * (tempx2 * Math.cos(Math.PI / numAxis) - tempy2 * Math.sin(Math.PI / numAxis));
            tempy1 = (1 / multiplierOnAxis) * (tempx2 * Math.sin(Math.PI / numAxis) + tempy2 * Math.cos(Math.PI / numAxis));
            if (!exactCoords) { //If exactCoords is false, makes it so that the image calculates the lines so that every line is within the size restraints.
                let tempx3 = tempx1;
                let tempy3 = tempy1;
                if (tempx1 < -size) {
                    tempx1 = -size;
                } else if (tempx1 > size) {
                    tempx1 = size;
                }
                if (tempy1 < -size) {
                    tempy1 = -size;
                } else if (tempy1 > size) {
                    tempy1 = size;
                }
                ctx.lineTo(size - tempx1, size + tempy1);
                tempx1 = tempx3;
                tempy1 = tempy3;
            } else {
                ctx.lineTo(size - tempx1, size + tempy1);
            }

            tempx2 = tempx1;
            tempy2 = tempy1;
            tempx1 = (multiplierOnAxis) * (tempx2 * Math.cos(Math.PI / numAxis) - tempy2 * Math.sin(Math.PI / numAxis));
            tempy1 = (multiplierOnAxis) * (tempx2 * Math.sin(Math.PI / numAxis) + tempy2 * Math.cos(Math.PI / numAxis));
            if (!exactCoords) {
                let tempx3 = tempx1;
                let tempy3 = tempy1;
                if (tempx1 < -size) {
                    tempx1 = -size;
                } else if (tempx1 > size) {
                    tempx1 = size;
                }
                if (tempy1 < -size) {
                    tempy1 = -size;
                } else if (tempy1 > size) {
                    tempy1 = size;
                }
                ctx.lineTo(size - tempx1, size + tempy1);
                tempx1 = tempx3;
                tempy1 = tempy3;
            } else {
                ctx.lineTo(size - tempx1, size + tempy1);
            }
        }
        //tempx1 = (numNodes - i + 2) * (size / numNodes) * Math.cos(degreesRotated * Math.PI / 180);
        //tempy1 = (numNodes - i + 2) * (size / numNodes) * Math.sin(degreesRotated * Math.PI / 180);
        ctx.moveTo(size - tempx1, size + tempy1); //prevents this weird line from being drawn idk
    }
}

//Makes the current color change rainbow colors
function calculateRGB() {
    if (r >= maxColorSaturation) {
        if (g > 0) {
            g = Math.max(0, g -= colorSpd);
            return;
        } else {
            if (b < maxColorSaturation) {
                b = Math.min (maxColorSaturation, b += colorSpd);
                return;
            }
        }
    } 
    if (b >= maxColorSaturation) {
        if (r > 0) {
            r = Math.max(0, r -= colorSpd);
            return;
        } else {
            if (g < maxColorSaturation) {
                g = Math.min (maxColorSaturation, g += colorSpd);
                return;
            }
        }
    }
    if (g >= maxColorSaturation) {
        if (b > 0) {
            b = Math.max(0, b -= colorSpd);
            return;
        } else {
            if (r < maxColorSaturation) {
                r = Math.min (maxColorSaturation, r += colorSpd);
                return;
            }
        }
    }
    //Increases saturation if all of the rgb values are less than maxColorSaturation
    if (r > g && r > b) {
        r++;
        return;
    }
    if (b > r && b > g) {
        b++;
        return;
    }
    g++;
    return;
}

//convert rgb value to hex value
function RGBToHex(r,g,b) {
    r = r.toString(16);
    g = g.toString(16);
    b = b.toString(16);
  
    if (r.length == 1)
      r = "0" + r;
    if (g.length == 1)
      g = "0" + g;
    if (b.length == 1)
      b = "0" + b;
  
    return "#" + r + g + b;
  }

