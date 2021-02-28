// Game & Ball Classes
var canvas = document.getElementById('canvas-test');
var ctx = canvas.getContext('2d');
var body = document.getElementById('body-uwu');
class Ball {
    constructor(xSpeed, ySpeed, damage, color = 'white') {
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;
        this.damage = damage;
        this.radius = 10;
        this.color = color;
        this.initX;
        this.initY;
        this.x;
        this.y;
    }
    getInitialPosition() {
        /** @type {CanvasRenderingContext2D}  */
        this.InitX = +canvas.width / 2;
        this.InitY = +canvas.height - (+canvas.height / 10);
        this.x = this.InitX;
        this.y = this.InitY;
    }
    draw() {
        /** @type {CanvasRenderingContext2D}  */
        let ball = new Path2D();
        ball.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true); // asumiendo que no conocieramos el exacto width y heigth usamos porcentaje?
        ctx.fillStyle = this.color;
        ctx.fill(ball);
    }
    move() {
        this.isBorderColliding();
        this.x += this.xSpeed;
        this.y += this.ySpeed;
    }
    isBorderColliding() {
        if (this.x + this.xSpeed < 0 || this.x + this.xSpeed > canvas.width) {
            this.xSpeed = -this.xSpeed;
        }
        if (this.y + this.ySpeed < 0 || this.y + this.xSpeed > canvas.height) {
            this.ySpeed = -this.ySpeed;
        }
    }
    delete() { 
        /* Lo que ocurre, es como el orden es dibujar, agregar FUTURO x e y, agendar new frame, dibujar... cuando se acaba y muere, el futuro x e y, quedan marcados, dislocando la posición real del actual frame, por lo cual acá resto lo que iba siendo la velocidad, y ahí sí funciona c: */
        /** @type {CanvasRenderingContext2D}  */
        this.x -= this.xSpeed;
        this.y -= this.ySpeed;

        // para debug
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(0, 0);
        ctx.strokeStyle = 'green';  
        ctx.stroke();
        // para debug

        ctx.clearRect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    }
    increaseSize() {

    }
    decreaseSize() {

    }
    stickToUser() {

    }
    increaseSpeed() {

    }
    decreaseSpeed() {

    }
    increaseDamage() {

    }
    decreaseDamage() {

    }
    isColliding() {

    }
    isDead() {
        if (this.y > +canvas.height - this.radius) {
            window.cancelAnimationFrame(ballID);
            this.delete();
            return true;
        }
        return false;
    }
    releaseBall() {

    }
}
function createBall() {
    const ball = new Ball(-5, -3, 1);
    ball.getInitialPosition();
    ball.draw();
    return ball;
}
const ball = createBall();
const moveBall = (x) => {
    ball.x = x;
    ball.draw();
}
let ballID = 0;
function ballAttachtToUser(event) {
    ctx.clearRect(0, 0, +canvas.width, +canvas.height);
    let x = event.clientX - (+body.clientWidth - +canvas.width) / 2;
    if (x < 0) x = 0;
    if (x > +canvas.width) x = +canvas.width;
    moveBall(x);
}
function getMouseXposition(funct) {
    window.addEventListener('mousemove', funct);
}
getMouseXposition(ballAttachtToUser);
moveOnClick();
cleanListenerMoveMouse(ballAttachtToUser);


function moveOnClick() {
    function algo() {
        /** @type {CanvasRenderingContext2D}  */
        ctx.clearRect(0, 0, +canvas.width, +canvas.height);
        ball.draw();
        ball.move();
        if (!ball.isDead()){
            ballID = window.requestAnimationFrame(algo);
        }
    }
    canvas.addEventListener('click', algo, { once: true });
}
function cleanListenerMoveMouse(funct) {
    function clearListener() {
        window.removeEventListener('mousemove', funct);
    }
    canvas.addEventListener('click', clearListener, { once: true })
}



class Game {
    /* El maxScore lo tomaríamos de localStorage, igual que el current lo mantendríamos
    ahí como tal, hasta que se vuelva el maxScore */
    constructor(maxScore, currentScore = 0, currentName = 'player', gameRound = 0, gameLives = 3, gameState = 'end', ballsAmount = 0) {
        this.maxScore = maxScore;
        this.currentScore = currentScore;
        this.currentName = currentName;
        this.gameRound = gameRound;
        this.gameLives = gameLives;
        this.gameState = gameState;
        this.ballsAmount = ballsAmount;
    }
    clearCanvas() {
        /** @type {CanvasRenderingContext2D}  */
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    renderBackground() {

    }
    renderNewGame() {
        /** @type {CanvasRenderingContext2D}  */
        this.clearCanvas();

        // render background
        // render blocks
        // render ball
        // render user
        // asigna el número de bolas en juego a 1
        // asignal el gameRound a 1
    }
    isGameOver() {
        // check if all the balls
    }
    addLife() {

    }
    removeLife() {

    }
    changeName() {

    }
    addNewMaxScore() {

    }
    updateCurrentScore() {

    }
    changeGameState() {

    }
    getGameState() {

    }

}

// UI 

