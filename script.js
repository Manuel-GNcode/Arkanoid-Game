const canvas = document.getElementById('canvas');

canvas.width = 500;
canvas.height = 500;

const ctx = canvas.getContext('2d');
let leftPressed = false;
let rightPressed = false;

const ball = {
    radius: 8,
    x: (canvas.width/2 - 4),
    y: (canvas.height - 30),
    sx: 2,
    sy: -2,
}
const board = {
    w: 80,
    h: 10,
    x: (canvas.width/2 - 40),
    y: (canvas.height - 30),
    sx: 10,
}

const drawBall = ()=>{
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
}
const drawPaddle = ()=>{
    ctx.fillStyle = '#fff';
    ctx.fillRect(board.x, board.y, board.w, board.h);
}

const drawBricks = ()=>{}

const collisionDetecton = ()=>{}

const ballMovement = ()=>{
    if (
        ball.x + ball.sx + ball.radius > canvas.width
        || ball.x + ball.sx < 0
    ) {
        ball.sx = -ball.sx;
    }
    if (ball.y + ball.sy < 0) {
        ball.sy = -ball.sy;
    }
    //Game over
    if (ball.y + ball.sy + ball.radius > canvas.height) {
        // ball.x = (canvas.width/2 - 4);
        // ball.y = (canvas.height - 30);
        ball.sy = -ball.sy;
    }
    ball.x += ball.sx;
    ball.y += ball.sy;
}

const paddleMovement = ()=>{}

const clearCanvas = ()=>{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

const draw = ()=>{
    clearCanvas();
    drawBall();
    drawPaddle();
    drawBricks();

    collisionDetecton();
    ballMovement();
    paddleMovement();

    window.requestAnimationFrame(draw);
}
draw()