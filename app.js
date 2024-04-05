const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let startX = 0;
let startY = 0;
let circles = [];
let isClick = true;


function startDrawing(e) {
    isDrawing = true;
    isClick = true;
    [startX, startY] = [e.offsetX, e.offsetY];
}


function drawCircle(e) {
    if (!isDrawing) return;
    const moveX = e.offsetX;
    const moveY = e.offsetY;

    if (Math.abs(moveX - startX) > 5 || Math.abs(moveY - startY) > 5) {
        isClick = false;
    }

    const endX = e.offsetX;
    const endY = e.offsetY;
    const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));


    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Redraw existing circles
    circles.forEach(circle => {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = circle.color;
        ctx.fill();
    });
    // Draw the current circle
    ctx.beginPath();
    ctx.arc(startX, startY, radius, 0, Math.PI * 2);
    ctx.fillStyle = getRandomColor();
    ctx.fill();
}

function endDrawing(e) {
    if (!isDrawing) return;
    if (isClick) {
        // If it was a click without significant movement, call onCanvasClick
        onCanvasClick(e);
    } else {
        // Finalize drawing the circle only if there was significant mouse movement
        drawCircle(e);
        circles.push({ x: startX, y: startY, radius: Math.sqrt(Math.pow(e.offsetX - startX, 2) + Math.pow(e.offsetY - startY, 2)), color: ctx.fillStyle });
    }
    isDrawing = false;
}

// Function to get a random color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Adding event listeners for mouse actions
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', drawCircle);
canvas.addEventListener('mouseup', endDrawing);

// Reset button functionality
document.getElementById('resetCanvas').addEventListener('click', function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    circles = []; // Clear the circles array
});

// Function to check if a point is inside a circle
function isPointInCircle(x, y, circleX, circleY, radius) {
    return Math.sqrt((x - circleX) ** 2 + (y - circleY) ** 2) < radius;
}

// Function to show and then hide feedback text after a few seconds
function showFeedback(text) {
    ctx.font = "50px Segoe UI";
    ctx.fillStyle = "#240A34";
    ctx.fillText(text, canvas.width / 2 - ctx.measureText(text).width / 2, 50);
    setTimeout(() => {
        redrawCircles(); // Redraw all circles to clear any text after a few seconds
    }, 500);
}

function onCanvasClick(e) {
    if (isDrawing || !isClick) return; // Ensure feedback is not shown during drawing

    const x = e.offsetX;
    const y = e.offsetY;
    let hit = false;

    // Using a traditional for loop instead of forEach to allow breaking out of the loop
    for (let i = 0; i < circles.length; i++) {
        const circle = circles[i];
        if (isPointInCircle(x, y, circle.x, circle.y, circle.radius)) {
            hit = true;
            // Break out of the loop once a hit is found
            break;
        }
    }

    if (hit) {
        showFeedback('Hit');
    } else {
        showFeedback('Miss');
    }
}


// Function to delete a circle on double click
function onCanvasDoubleClick(e) {
    const x = e.offsetX;
    const y = e.offsetY;

    for (let i = circles.length - 1; i >= 0; i--) {
        const circle = circles[i];
        if (isPointInCircle(x, y, circle.x, circle.y, circle.radius)) {
            circles.splice(i, 1); // Remove the circle from the array
            redrawCircles(); // Redraw the canvas without the deleted circle
            break;
        }
    }
}

// Function to redraw all circles (useful after deletion)
function redrawCircles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    circles.forEach(circle => {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = circle.color;
        ctx.fill();
    });
}

// Adding event listeners for click and double-click actions on the canvas
canvas.addEventListener('mousedown', (e) => {
    isClick = true; // Reset isClick on mousedown
    startDrawing(e);
});
canvas.addEventListener('mousemove', drawCircle);
canvas.addEventListener('mouseup', endDrawing);
canvas.addEventListener('click', onCanvasClick);
canvas.addEventListener('dblclick', onCanvasDoubleClick);
