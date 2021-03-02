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
        if (this.y > (this.InitY + this.radius + 10)) {
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
        return (ballX + ballRadius >= this.x - (this.width / 2) && ballX + ballRadius <= this.x + (this.width / 2) && ballY + ballRadius >= this.y);
    }
}

class Game {

    constructor(currentScore = 0, currentName = 'player', gameRound = 1, gameLives = 3, ballsAmount = 1) {
        this.maxScore;
        this.nameMaxScore;
        this.currentScore = currentScore;
        this.currentName = currentName;
        this.gameRound = gameRound;
        this.gameLives = gameLives;
        this.ballsAmount = ballsAmount;
        this.nextFrameID = 0; // esto sería el ballID
        this.userXposition = 0;
        this.ball;
        this.userPlatform;
        this.bricks;
    }
    clearCanvas() {
        /** @type {CanvasRenderingContext2D}  */
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    renderNewGame() {
        /** @type {CanvasRenderingContext2D}  */
        this.bricks = [];
        const ball = this.initBall(-3, -3, 1);
        const user = this.initPlatform();
        const brick = this.initBricks();
        this.bricks.push(...brick);
        const drawingFunction = () => this.drawWaitingGame();
        this.ball = ball;
        this.userPlatform = user;
        this.drawInit();
        this.addEvents(window, 'mousemove', event => this.setUserPosition(event));
        this.addEvents(window, 'mousemove', drawingFunction);
        this.addEvents(canvas, 'click', () => this.drawStartedGame(), { once: true });
        this.addEvents(canvas, 'click', () => this.removeEvents(window, 'mousemove', drawingFunction), { once: true });
    }
    initBricks() {
        let bricksArray = [];
        for (let index = 1; index <= 8; index++) {
            for (let Yindex = 1; Yindex <= 3; Yindex++) {
                let x = 10;
                let y = 10;
                let mult = 60;
                let brick = new Brick(1, 50, 20, (x + (mult * index)), y + (mult * Yindex));
                bricksArray.push(brick);   
            }

        }
        return bricksArray;
    }
    initBall(xSpeed, ySpeed, dmg) {
        const ball = new Ball(xSpeed, ySpeed, dmg);
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
    drawInit() {
        this.ball.draw();
        this.userPlatform.draw();
        this.bricks.forEach(brick => brick.draw());
    }
    drawWaitingGame() {
        this.clearCanvas();
        let x = this.userXposition;
        let userX = this.drawWaitingUser(x);
        this.drawWaitingBall(userX);
        this.userPlatform.draw();
        this.ball.draw();
        this.bricks.forEach(brick => brick.draw());
    }
    drawWaitingBall(x) {
        this.ball.moveOverPlatform(x);
    }
    drawWaitingUser(x) {
        return this.userPlatform.move(x);
    }
    drawStartedGame() {
        this.clearCanvas();
        if (this.userPlatform.ballIsFrontColliding(...this.ball.getNextPosition(), this.ball.radius)) this.ball.changeYspeed();
        this.drawStartedBall(this.ball);
        this.drawStartedUser(this.userPlatform);
        this.bricks.forEach(brick => brick.draw());
        this.bricks.forEach(brick => {
            if (brick.ballIsFrontColliding(...this.ball.getNextPosition(), this.ball.radius)) {
                let index = this.bricks.indexOf(brick);
                this.bricks.splice(index, 1);
                this.ball.changeYspeed();
            } else if (brick.ballIsSideColliding(...this.ball.getNextPosition(), this.ball.radius)) {
                let index = this.bricks.indexOf(brick);
                this.bricks.splice(index, 1);
                this.ball.changeXspeed();
            }
        });
        if (!this.ball.isDead(this.nextFrameID)) {
            this.nextFrameID = window.requestAnimationFrame(() => this.drawStartedGame());
        } else {
            window.cancelAnimationFrame(this.nextFrameID);
            this.removeLife();
            if (!this.isGameOver()) {
                window.setTimeout(() => {
                    this.clearCanvas();
                    this.renderNewGame();
                }, 500);
            }
        }
    }
    drawStartedBall() {
        this.ball.draw();
        this.ball.move();
    }
    drawStartedUser() {
        this.userPlatform.move(this.userXposition);
        this.userPlatform.draw();
    }
    addEvents(objectToAttatch, eventType, eventFunction, eventOptions = {}) {
        objectToAttatch.addEventListener(eventType, eventFunction, eventOptions);
    }
    removeEvents(objectToAttatch, eventType, eventFunction, eventOptions = {}) {
        objectToAttatch.removeEventListener(eventType, eventFunction, eventOptions);
    }
    isGameOver() {
        return (this.gameLives === 0);
    }
    addLife() {
        this.gameLives += 1;
    }
    removeLife() {
        this.gameLives -= 1;
    }
    changeName(newName) {
        this.changeName = newName.replace(/\W/g, '').slice(0, 5);
    }
    addNewMaxScore() {
        // Acá agregaríamos una función para cambiarlo en la UI también
        localStorage.setItem(this.currentName, this.currentScore);
    }
    updateCurrentScore(score) {
        this.currentScore = score;
    }
    getMaxScore() { // se supone que el entrie sería del tipo [ ['uwu', 10], ['awa', 20]   ]
        const scores = Object.entries(localStorage).sort((a, b) => a[1] - b[1]);
        this.nameMaxScore = scores[0][0];
        this.maxScore = scores[0][1];
    }
}

class Brick {
    constructor(durability = 1, width = 50, height = 20, x, y) {
        this.durability = durability;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
    }
    draw() {
        let brick = new Path2D();
        brick.rect(this.x, this.y, this.width, this.height);
        /** @type {CanvasRenderingContext2D}  */
        ctx.fillStyle = 'yellow';
        ctx.shadowColor = 'black';
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 5;
        ctx.fill(brick);
        ctx.shadowColor = 'transparent';
    }
    ballIsSideColliding(ballX, ballY, ballRadius) {
        if (ballX + ballRadius == this.x && ballY >= this.y && ballY <= this.y + this.height || ballX + ballRadius == this.x + this.width && ballY >= this.y && ballY <= this.y + this.height) {
            this.delete();
            return true;
        }
        return false;
    }
    ballIsFrontColliding(ballX, ballY, ballRadius) {
        if (ballX + ballRadius >= this.x && ballX + ballRadius <= this.x + this.width && ballY >= this.y && ballY <= this.y + this.height) {
            this.delete();
            return true;
        }
        return false;
    }
    delete() {
        ctx.clearRect(this.x, this.y, this.width, this.height);
    }
}

// UI // quizá deberíamos crear una nueva variable con el diámetro y no solo con el radio de la bola


let game = new Game(0, 'uwu', 1, 3, 1);
game.renderNewGame();

/* Debería detectar si entre la posición actual y la posición siguiente hay un overlap de x/y para detectar la colisión */