var canvas = document.querySelector('canvas');
var restartBtn = document.getElementById('restartBtn');

// Set canvas width and height 
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var ctx = canvas.getContext('2d');

// Neon color array
var colorArray = [
    "#00FFFF", "#FF00FF", "#00FF00", "#FFFF00", "#FF4500",
    "#FF1493", "#FF69B4", "#8A2BE2", "#1E90FF", "#FF8C00"
];

// Circle constructor function
function Circle(x, y, radius, dx, dy, color, isStatic = false) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dx = dx;
    this.dy = dy;
    this.color = color || colorArray[Math.floor(Math.random() * colorArray.length)];
    this.isStatic = isStatic;

    this.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);

        // Apply neon glow effect
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;

        ctx.lineWidth = 4;
        if (!isStatic) {
            ctx.fillStyle = this.color;
            ctx.fill();
        } else {
            ctx.strokeStyle = this.color;
            ctx.stroke();
        }

        // Reset shadow after drawing
        ctx.shadowBlur = 0;
    };

    this.update = function () {
        if (!this.isStatic) {
            if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
                this.dx = -this.dx;
            }
            this.x += this.dx;

            if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
                this.dy = -this.dy;
            }
            this.y += this.dy;
        }

        this.draw();
    };

    this.setPosition = function (x, y) {
        this.x = x;
        this.y = y;
    };

    this.isCollidingWith = function (otherCircle) {
        var dx = this.x - otherCircle.x;
        var dy = this.y - otherCircle.y;
        var distSquared = dx * dx + dy * dy;
        var radiusSumSquared = (this.radius + otherCircle.radius) ** 2;
        return distSquared < radiusSumSquared;
    };
}

var circleArray = [];
var disappearedCirclesCount = 0;

function initGame() {
    circleArray = [];
    disappearedCirclesCount = 0;
    
    // Add bouncing circles
    for (let i = 0; i < 25; i++) {
        let radius = 15;
        var x = Math.random() * (innerWidth - radius * 2) + radius;
        var y = Math.random() * (innerHeight - radius * 2) + radius;
        var dx = (Math.random() - 0.5) * 10;
        var dy = (Math.random() - 0.5) * 10;
        circleArray.push(new Circle(x, y, radius, dx, dy));
    }

    // Add the static white circle
    let whiteRadius = 15;
    var whiteX = Math.random() * (innerWidth - whiteRadius * 2) + whiteRadius;
    var whiteY = Math.random() * (innerHeight - whiteRadius * 2) + whiteRadius;
    whiteCircle = new Circle(whiteX, whiteY, whiteRadius, 0, 0, 'white', true);
    circleArray.push(whiteCircle);

    restartBtn.style.display = 'none'; // Hide restart button
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    // Display ball count
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Ball Count: ${25 - disappearedCirclesCount}`, innerWidth - 250, 90);

    circleArray = circleArray.filter(circle => {
        if (circle !== whiteCircle && whiteCircle.isCollidingWith(circle)) {
            disappearedCirclesCount++;
            return false;
        }
        circle.update();
        return true;
    });

    // If all balls are gone, show restart button
    if (disappearedCirclesCount >= 25) {
        restartBtn.style.display = 'block';
    }
}

// Start the game
initGame();
animate();

// Restart game when button is clicked
restartBtn.addEventListener('click', function () {
    initGame();
});
  
// Mouse move event listener
canvas.addEventListener('mousemove', function (event) {
    var rect = canvas.getBoundingClientRect();
    var mouseX = event.clientX - rect.left;
    var mouseY = event.clientY - rect.top;
    whiteCircle.setPosition(mouseX, mouseY);
});

// Touch move event listener for mobile
canvas.addEventListener('touchmove', function (event) {
    var touch = event.touches[0];
    var rect = canvas.getBoundingClientRect();
    var touchX = touch.clientX - rect.left;
    var touchY = touch.clientY - rect.top;
    whiteCircle.setPosition(touchX, touchY);
});
