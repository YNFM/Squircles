let canvas = document.getElementById("myCanvas-el");
let ctx = canvas.getContext("2d");

/* =========================
RESIZE CANVAS TO SCREEN SIZE
========================== */

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

/* =========================
GAME FRAMEWORK
========================== */

let playerLevel = 1;

function drawPlayerLevel() {
    ctx.font = "3em Arial";
    ctx.fillStyle = "steelblue";
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    ctx.fillText("Level: "+playerLevel, 8, 8);
}
drawPlayerLevel();

function addPlayerLevel() {
    playerLevel++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayerLevel();
    playGameLevel();
}

/* =========================
LEVEL ONE: CLICK ANYWHERE ON THE SCREEN
========================== */

function playLevelOne() {
    function startingText() {
        ctx.fillStyle = "steelblue";
        ctx.font = "6em Arial";
        ctx.textAlign="center"; 
        ctx.textBaseline = "bottom";
        ctx.fillText("CLICK ANYWHERE", (canvas.width/2), (canvas.height/2));
    }

    startingText();

    canvas.addEventListener('click', clickedAnywhereOn, false); 

    function clickedAnywhereOff() {
        canvas.removeEventListener('click', clickedAnywhereOn); 
    }

    function clickedAnywhereOn(event) {
        addPlayerLevel();
        clickedAnywhereOff();
    }
}

/* =========================
LEVEL TWO: CLICK A BALL
========================== */  

function playLevelTwo() {
    let ballRadius = Math.min(canvas.height, canvas.width)/3; // size of ball relative to canvas height
    let x = canvas.width/2; // start ball in middle of page
    let y = canvas.height/2; // start ball in middle of page
    let elemLeft = canvas.offsetLeft;
    let elemTop = canvas.offsetTop;  
    
    // draw ball
    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI*2);
        ctx.fillStyle = "steelblue";
        ctx.fill();
        ctx.closePath();
    }
    
    // text inside ball
    function startingText() {
        ctx.fillStyle = "paleturquoise";
        ctx.font = "3em Arial";
        ctx.textAlign="center"; 
        ctx.textBaseline = "middle";
        ctx.fillText("CLICK ME", (canvas.width/2), (canvas.height/2));
    }

    drawBall();
    startingText();

    // click listener, add point if correct, etc

    canvas.addEventListener('click', clickedInCircleOn, false); 

    function clickedInCircleOff() {
        canvas.removeEventListener('click', clickedInCircleOn); 
    }

    function clickedInCircleOn(event) {
        let xClick = event.pageX - elemLeft;
        let yClick = event.pageY - elemTop;

        // console.log("CLICKED: (xClick,yClick) ", xClick, yClick);
        // console.log("ballradius",  ballRadius+x, x-ballRadius,  ballRadius+y, y-ballRadius);

        if ( (xClick > x-ballRadius && xClick < ballRadius+x) && (yClick > y-ballRadius && yClick < ballRadius+y) ) { 
            addPlayerLevel();
        }

        clickedInCircleOff();
    }
}

/* =========================
LEVEL THREE: CLICK A MOVING BALL 10 TIMES
========================== */

function playLevelThree() {
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

    function startingText() {
        ctx.fillStyle = "paleturquoise";
        ctx.font = "3em Arial";
        ctx.textAlign="center"; 
        ctx.textBaseline = "middle";
        ctx.fillText("CLICK ME 10 TIMES", (canvas.width/2), (canvas.height/2));
    }

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
        drawPlayerLevel();
        ctx.font = "3em Arial";
        ctx.fillStyle = "steelblue";
        ctx.textBaseline = "bottom";
        ctx.textAlign = "left";
        ctx.fillText("Streak: "+score, 8, canvas.height-8);
        // ctx.font = "3em Arial";
        // ctx.fillStyle = "steelblue";
        // ctx.textBaseline = "bottom";
        // ctx.textAlign = "left";
        // ctx.fillText("Longest Streak: "+highestScore, 8, canvas.height-8); 
    } 

    drawBall();
    drawScore();
    startingText();

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
        
        ballRadius = Math.min(canvas.height, canvas.width)/3; // size of ball relative to canvas height
        x = canvas.width/2; // start ball in middle of page
        y = canvas.height/2; // start ball in middle of page
        ballSpeed = 1;
        dx = ballSpeed; // movement of ball relative to current position, x axis
        dy = ballSpeed; // movement of ball relative to current position, y axis
        score = 0;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        drawScore();
        startingText();
    }

    // click listener, add point if correct, etc
	canvas.addEventListener('click', clickedInCircleOn, false); 
	
	function clickedInCircleOff() {
        canvas.removeEventListener('click', clickedInCircleOn); 
    }
	
	function clickedInCircleOn(event) {
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

        if (score===10) {
            clickedInCircleOff();
            cancelAnimationFrame(moveCircleAnimation);
            addPlayerLevel();
        }
    }
}

/* =========================
LEVEL FOUR: CLICK THE BLUE BALL
========================== */

function playLevelFour() {
    function startingText() {
        ctx.fillStyle = "steelblue";
        ctx.font = "6em Arial";
        ctx.textAlign="center"; 
        ctx.textBaseline = "bottom";
        ctx.fillText("LEVEL COMING SOON", (canvas.width/2), (canvas.height/2));
    }

    startingText();
}

/* =========================
LEVEL FIVE: DRAG A BALL
========================== */

function playLevelFive() {
    
}

/* =========================
LEVEL SIX: DRAG A BALL INTO A HOLE
========================== */

function playLevelSix() {
    
}

/* =========================
GAME LEVEL SELECTION
========================== */

function playGameLevel() {
    switch (playerLevel) {
        case 1: playLevelOne(); break;
        case 2: playLevelTwo(); break;
        case 3: playLevelThree(); break;
        case 4: playLevelFour(); break;
        case 5: playLevelFive(); break;
        case 6: playLevelSix(); break;
    }
}

playGameLevel();

console.log(playerLevel);
