let canvas = document.getElementById("myCanvas-el");
let ctx = canvas.getContext("2d");

// resize canvas to screen size
(function() {
    initialise();
    
    function initialise() {
        window.addEventListener('resize', resizeCanvas, false);
        resizeCanvas();
    }
    
    function redraw() {
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = '0';
        ctx.strokeRect(0, 0, window.innerWidth, window.innerHeight);
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        redraw();
    }
})();

// rest of code
let ballRadius = Math.min(canvas.height, canvas.width)/3; // size of ball relative to canvas height
let x = canvas.width/2; // start ball in middle of page
let y = canvas.height/2; // start ball in middle of page
let ballSpeed = 1;
let dx = ballSpeed; // movement of ball relative to current position, x axis
let dy = ballSpeed; // movement of ball relative to current position, y axis
let score = 0;
let elemLeft = canvas.offsetLeft;
let elemTop = canvas.offsetTop;  
let moveCircleAnimation;
let highestScore = 0;
// let playerAlive = true;

// draw ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "steelblue";
    ctx.fill();
    ctx.closePath();
}

// write score
function drawScore() {
    ctx.font = "2vw Arial";
    ctx.fillStyle = "steelblue";
    ctx.fillText("Streak: "+score, 8, 40);
    ctx.font = "2vw Arial";
    ctx.fillStyle = "steelblue";
    ctx.fillText("Longest Streak: "+highestScore, 8, canvas.height-40);
} 

drawBall();
drawScore();

// redraw circle in new location
function moveCircle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawScore();
    //   console.log("Ball moving: (x,y) ", x, ", ", y)
    if(x + dx > canvas.width-ballRadius*1.025 || x + dx < ballRadius*1.025) {dx = -dx;} // keep ball on screen
    if(y + dy > canvas.height-ballRadius*1.025 || y + dy < ballRadius*1.025) {dy = -dy;} // keep ball on screen
    x += dx; 
    y += dy;
    moveCircleAnimation = requestAnimationFrame(moveCircle);
    // console.log(moveCircleAnimation);
} 

function addToStreak() {
    score += 1;
    // ball radius and speed related to score
    ballRadius *= 0.975;
    ballSpeed += 0.5; 

    if (dx >= 0) {
        dx = ballSpeed; // movement of ball relative to current position, x axis
    } else {
        dx = -ballSpeed; // movement of ball relative to current position, x axis
    }

    if (dy >= 0) {
        dy = ballSpeed; // movement of ball relative to current position, y axis
    } else {
        dy = -ballSpeed; // movement of ball relative to current position, y axis
    }
    
    moveCircle();
}

function streakLost() {
    if (score > highestScore) {
        highestScore = score;
    }
    
    ballRadius = canvas.height/3; // size of ball relative to canvas height
    x = canvas.width/2; // start ball in middle of page
    y = canvas.height/2; // start ball in middle of page
    ballSpeed = 1;
    dx = ballSpeed; // movement of ball relative to current position, x axis
    dy = ballSpeed; // movement of ball relative to current position, y axis
    score = 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawScore();
}

// click listener, add point if correct, etc
canvas.addEventListener('click', function(event) {
    let xClick = event.pageX - elemLeft;
    let yClick = event.pageY - elemTop;

    cancelAnimationFrame(moveCircleAnimation);
    // console.log(moveCircleAnimation);

    // console.log("CLICKED: (xClick,yClick) ", xClick, yClick);
    // console.log("ballradius",  ballRadius+x, x-ballRadius,  ballRadius+y, y-ballRadius);

    if ( (xClick > x-ballRadius && xClick < ballRadius+x) && (yClick > y-ballRadius && yClick < ballRadius+y) ) { 
        addToStreak();
    } else {
        streakLost();
    }
}, false); 

function gameOver() {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.lineWidth = "6";
    ctx.strokeStyle = "darkred";
    ctx.fillStyle = "firebrick";
    let rectangleWidth = canvas.width/2;
    let rectangleHeight = canvas.height/2;
//    ctx.rect(canvas.width/2, canvas.height/2, rectangleWidth, rectangleHeight);
    ctx.stroke();
    ctx.fillRect((canvas.width/2)-(rectangleWidth/2), (canvas.height/2)-(rectangleHeight/2), rectangleWidth, rectangleHeight);
    ctx.fillStyle = "white";
    ctx.font = "24pt Arial";
    ctx.textAlign="center"; 
    ctx.textBaseline = "middle";
    ctx.fillText("GAME OVER", (canvas.width/2), (canvas.height/2));
}

// add additional balls, different colour