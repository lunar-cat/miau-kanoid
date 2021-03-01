// Global Canvas / Context & Body
var canvas = document.getElementById('canvas-test');
var ctx = canvas.getContext('2d');
var body = document.getElementById('body-uwu');

// Ball Class
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
    getCurrentPosition() {
        return [this.x, this.y];
    }
    getNextPosition() {
        return [this.x + this.xSpeed, this.y + this.ySpeed];
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
        if (this.x + this.xSpeed - this.radius < 0 || this.x + this.xSpeed + this.radius > canvas.width) {
            this.changeXspeed();
        }
        if (this.y + this.ySpeed - this.radius < 0 || this.y + this.xSpeed + this.radius > canvas.height) {
            this.changeYspeed();
        }
    }
    changeYspeed() {
        this.ySpeed = -this.ySpeed;
    }
    changeXspeed() {
        this.xSpeed = -this.xSpeed;
    }
    delete() {
        /* Lo que ocurre, es como el orden es dibujar, agregar FUTURO x e y, agendar new frame, dibujar... cuando se acaba y muere, el futuro x e y, quedan marcados, dislocando la posición real del actual frame, por lo cual acá resto lo que iba siendo la velocidad, y ahí sí funciona c: */
        /** @type {CanvasRenderingContext2D}  */
        this.x -= this.xSpeed;
        this.y -= this.ySpeed;

        // para debug 
        let line = new Path2D();
        line.moveTo(this.x, this.y);
        line.lineTo(0, 0);
        ctx.strokeStyle = 'green';
        ctx.stroke(line);
        // para debug

        ctx.clearRect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    }
    increaseSize() {
        this.radius *= 2;
    }
    decreaseSize() {
        this.radius /= 2;
    }
    increaseSpeed(x = this.x, y = this.y) {
        this.x += x;
        this.y += y;
    }
    decreaseSpeed(x = this.x, y = this.y) {
        this.x -= x;
        this.y -= y;
    }
    increaseDamage() {
        this.damage += 1;
    }
    decreaseDamage() {
        this.damage -= 1;
    }
    isDead() {
        if (this.y > (this.InitY + this.radius)) { 
            this.delete();
            return true;
        }
        return false;
    }
    moveOverPlatform(platformX) {
        this.x = platformX;
    }
}

class Player {
    constructor(color = 'black') {
        this.width = 100;
        this.height = 15;
        this.color = color;
        this.initX;
        this.initY;
        this.x;
        this.y;
    }
    getInitialPosition() {
        /** @type {CanvasRenderingContext2D}  */
        this.InitX = +canvas.width / 2;
        this.InitY = +canvas.height - (+canvas.height / 10) + 10 + 4; // los 10 del ball.radius // los +4 por si le ponemos un stroke con 4 de lineWidth, según entiendo se le agrega encima al tamaño normal
        this.x = this.InitX;
        this.y = this.InitY;
    }
    draw() {
        /** @type {CanvasRenderingContext2D}  */
        let platform = new Path2D();
        platform.rect(this.x - (this.width / 2), this.y, this.width, this.height);
        ctx.fillStyle = 'gray';
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 4;
        ctx.stroke(platform);
        ctx.fill(platform);
    }
    move(x) {
        this.x = x - (+body.clientWidth - +canvas.width) / 2;
        if (this.x < 0) this.x = 0;
        if (this.x > +canvas.width) this.x = +canvas.width;
        return this.x; // este return para que la bola siga el movimiento del mouse antes de lanzar
    }
    /* Para estas  variables, deberíamos pasar igual el ball.radius en vez de sumar "10"
    porque si la bola crece, cambia po */
    ballIsFrontColliding(ballX, ballY, ballRadius) {
        return (ballX + ballRadius >= this.x - (this.width / 2) && ballX - ballRadius <= this.x + (this.width / 2) && ballY + ballRadius >= this.y);
    }
}

/* podríamos hacer la bola y el user globales en la clase poniendolos como this.ball = ball?XD */
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
        this.nextFrameID = 0; // esto sería el ballID
        this.userXposition = 0;
    }

    clearCanvas() {
        /** @type {CanvasRenderingContext2D}  */
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    renderNewGame() {
        /** @type {CanvasRenderingContext2D}  */
        const ball = this.initBall();
        const user = this.initPlatform();
        const drawingFunction = () => {
            this.drawWaitingGame(ball, user);
        }
        this.drawInit(ball, user);
        this.addEvents(window, 'mousemove', (event) => this.setUserPosition(event));
        this.addEvents(window, 'mousemove', drawingFunction);
        this.addEvents(canvas, 'click', this.drawStartedGame.bind(this, ball, user), { once: true });
        this.addEvents(canvas, 'click', () =>  this.removeEvents(window, 'mousemove', drawingFunction), {once: true});
    }
    initBall() {
        const ball = new Ball(-3, -3, 1);
        ball.getInitialPosition();
        return ball;
    }
    initPlatform() {
        const platformUser = new Player();
        platformUser.getInitialPosition();
        return platformUser;
    }
    setUserPosition(event) {
        let xUser = event.clientX;
        this.userXposition = +xUser;
    }
    drawInit(ball, platformUser) {
        ball.draw();
        platformUser.draw();
    }
    drawWaitingGame(ball, user) {
        this.clearCanvas();
        let x = this.userXposition;
        let userX = this.drawWaitingUser(user, x);
        this.drawWaitingBall(ball, userX);
        user.draw();
        ball.draw();
    }
    drawWaitingBall(ball, x) {
        ball.moveOverPlatform(x);
    }
    drawWaitingUser(user, x) {
        return user.move(x);
    }
    drawStartedGame(ball, user) {
        this.clearCanvas();
        if (user.ballIsFrontColliding(...ball.getNextPosition(), ball.radius)) ball.changeYspeed();
        this.drawStartedBall(ball);
        this.drawStartedUser(user);
        if (!ball.isDead(this.nextFrameID)) {
            this.nextFrameID = window.requestAnimationFrame(this.drawStartedGame.bind(this, ball, user));
        } else {
            window.cancelAnimationFrame(this.nextFrameID);
            window.setTimeout(() => {
                this.clearCanvas();
                this.renderNewGame();
            }, 500);
        }
    }
    drawStartedBall(ball) {
        ball.draw();
        ball.move();
    }
    drawStartedUser(user) {
        user.move(this.userXposition);
        user.draw();
    }
    addEvents(objectToAttatch, eventType, eventFunction, eventOptions = {}) {
        objectToAttatch.addEventListener(eventType, eventFunction, eventOptions);
    }
    removeEvents(objectToAttatch, eventType, eventFunction, eventOptions = {}) {
        objectToAttatch.removeEventListener(eventType, eventFunction, eventOptions);
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

let game = new Game(0, 0, 'uwu', 1, 3, 'continue', 3);
game.renderNewGame();