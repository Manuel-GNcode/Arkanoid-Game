const canvas = document.getElementById('canvas');
const startBtn = document.getElementById('start');
const resetBtn = document.getElementById('reset');
const $lost = document.getElementById('lost');
const $win = document.getElementById('win');

const $paddle = document.getElementById('paddle');
const $bricks = document.getElementById('bricks');

canvas.width = 500;
canvas.height = 450;

const ctx = canvas.getContext('2d');
let leftPressed = false;
let rightPressed = false;

let isPlaying = false;

let speedBall = 3;
let ball = {
    radius: 4,
    x: (canvas.width/2 - 2),
    y: (canvas.height - 40 - 2),
    sx: speedBall,
    sy: -speedBall,
}

let board = {
    w: 70,
    h: 15,
    x: (canvas.width/2 - 35),
    y: (canvas.height - 20),
    sx: 8,
}
const bricks = {
    r: 5,
    c: 9,
    w: 50,
    h: 20,
    top: 25,
    left: 25,
}

const generateLevel = ()=>{
    let arr = [];
    for (let col = 0; col < bricks.c; col++) {
        arr[col] = [];
        for (let row = 0; row < bricks.r; row++) {
            const brickX = bricks.left + (col * (bricks.w));
            const brickY = bricks.top + (row * (bricks.h));
            const colorN = Math.floor(Math.random()*8);
            arr[col][row] = {brickX, brickY, status: 1, color: colorN};
        }
    }
    return arr;
}
let arrBricks = generateLevel();

const drawBall = ()=>{
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.closePath();
}
const drawPaddle = ()=>{
    ctx.drawImage(
        $paddle,
        0,
        0,
        88,
        22,
        board.x,
        board.y,
        board.w,
        board.h
    )
}

const drawBricks = ()=>{
    for (let col = 0; col < bricks.c; col++) {
        for (let row = 0; row < bricks.r; row++) {
            const currentBrick = arrBricks[col][row];
            if (currentBrick.status == 0) continue;
            ctx.drawImage(
                $bricks,
                (16*currentBrick.color),
                0,
                15.5,
                7.5,
                currentBrick.brickX,
                currentBrick.brickY,
                bricks.w,
                bricks.h,
            )
        }
    }
}

const collisionDetecton = ()=>{
    for (let col = 0; col < bricks.c; col++) {
        for (let row = 0; row < bricks.r; row++) {
            const currentBrick = arrBricks[col][row];
            if (currentBrick.status == 0) continue;

            const collisionXBrick = 
            ball.x > currentBrick.brickX &&
            ball.x < currentBrick.brickX + bricks.w;

            const collisionYBrick = 
            ball.y > currentBrick.brickY &&
            ball.y < currentBrick.brickY + bricks.h;

            const collisionLeftBrick = 
            ball.x > currentBrick.brickX &&
            ball.x < currentBrick.brickX + speedBall;
            const collisionRightBrick = 
            ball.x < currentBrick.brickX+bricks.w  &&
            ball.x > currentBrick.brickX+bricks.w - speedBall;

            const collisionTopBrick = 
            ball.y > currentBrick.brickY &&
            ball.y < currentBrick.brickY + speedBall;
            const collisionBottomBrick = 
            ball.y < currentBrick.brickY+bricks.h &&
            ball.y > currentBrick.brickY+bricks.h - speedBall;

            if (collisionXBrick && collisionYBrick) {
                currentBrick.status = 0;
                if (
                    collisionLeftBrick || collisionRightBrick
                ) {
                    ball.sx = -ball.sx;
                }
                else if (
                    collisionTopBrick || collisionBottomBrick
                ) {
                    ball.sy = -ball.sy;
                }
            }
            
        }
    }
}

const ballMovement = ()=>{
    if (
        ball.x + ball.sx > canvas.width
        || ball.x + ball.sx < 0
    ) {
        ball.sx = -ball.sx;
    }
    if (ball.y + ball.sy < 0) {
        ball.sy = -ball.sy;
    } else if (
        ball.x > board.x &&
        ball.x < board.x+board.w &&
        ball.y > board.y &&
        ball.y < board.y+board.h
    ) {
        ball.sy = -ball.sy
    }
    
    if (ball.y-ball.radius > canvas.height) {
        $lost.style.display = 'block';
        isPlaying = false;
    }
    if (isPlaying) {
        ball.x += ball.sx;
        ball.y += ball.sy;
    }
}

const paddleMovement = ()=>{
    if (board.x < 0) {
        leftPressed = false;
    }
    if (board.x+board.w > canvas.width) {
        rightPressed = false;
    }
    if (rightPressed) {
        board.x += board.sx;
    } else if (leftPressed) {
        board.x -= board.sx;
    }
}

const clearCanvas = ()=>{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
const initEvents = ()=>{
    document.addEventListener('keydown', (e)=>{
        if (e.key == 'ArrowRight' || e.key == 'Right') {
            rightPressed = true;
        } else if (e.key == 'ArrowLeft' || e.key == 'Left') {
            leftPressed = true;
        }
    });
    document.addEventListener('keyup', (e)=>{
        if (e.key == 'ArrowRight' || e.key == 'Right') {
            rightPressed = false;
        } else if (e.key == 'ArrowLeft' || e.key == 'Left') {
            leftPressed = false;
        }
    })
}
const resetGame = ()=>{
    isPlaying = false;
    ball = {
        radius: 4,
        x: (canvas.width/2 - 2),
        y: (canvas.height - 40 - 2),
        sx: speedBall,
        sy: -speedBall,
    }
    board = {
        w: 70,
        h: 15,
        x: (canvas.width/2 - 35),
        y: (canvas.height - 20),
        sx: 8,
    }

    $lost.style.display = 'none';
    $win.style.display = 'none';

    arrBricks = generateLevel();
    draw();
}
const winGame = ()=>{
    let isWin = true;
    for (let col = 0; col < bricks.c; col++) {
        for (let row = 0; row < bricks.r; row++) {
            const currentBrick = arrBricks[col][row];
            if (currentBrick.status == 1) {
                isWin = false;
                break;
            };

        }
    }
    if (isWin) {
        $win.style.display = 'block';
        isPlaying = false;
        console.log('2')
    }
}

const draw = ()=>{
    clearCanvas();
    drawBall();
    drawPaddle();
    drawBricks();
    winGame();

    collisionDetecton();
    ballMovement();
    paddleMovement();

    if (isPlaying) window.requestAnimationFrame(draw);
}
draw();
initEvents();

startBtn.addEventListener('click', ()=>{
    isPlaying = true;
    draw();
})
resetBtn.addEventListener('click', resetGame);