// Global Canvas, Context & Body
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
        this.isAlreadyColliding = false;
        this.isAlreadyFaster = false;
    }
    getCurrentPosition() {
        return [this.x, this.y];
    }
    getNextPosition() {
        return [this.x + this.xSpeed, this.y + this.ySpeed];
    }
    setInitialPosition() {
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
        this.isAlreadyColliding = false;
    }
    move() {
        this.isBorderColliding();
        this.x += this.xSpeed;
        this.y += this.ySpeed;
    }
    isBorderColliding() {
        if ((this.x) <= this.radius || (canvas.width - this.x) <= this.radius) this.changeXspeed();
        if ((this.y) <= this.radius || (canvas.height - this.y) <= this.radius) this.changeYspeed();
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
        /*         let line = new Path2D();
                line.moveTo(this.x, this.y);
                line.lineTo(0, 0);
                ctx.strokeStyle = 'green';
                ctx.stroke(line); */
        // para debug
        ctx.clearRect(this.x - this.radius - 5, this.y - this.radius - 5, this.radius * 2 + 10, this.radius * 2 + 10);
    }
    increaseSize() {
        this.radius *= 2;
    }
    decreaseSize() {
        this.radius /= 2;
    }
    increaseSpeed() {
        this.xSpeed += (this.xSpeed < 0)
            ? -1
            : 1;
        this.ySpeed += (this.ySpeed < 0)
            ? -1
            : 1;
        this.isAlreadyFaster = true;
    }
    decreaseSpeed() {
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
        if (this.y + this.ySpeed + this.radius >= canvas.height) {
            this.delete();
            return true;
        }
        return false;
    }
    moveOverPlatform(platformX) {
        this.x = platformX;
    }
}

// Player Platform Class
class Player {
    constructor(color = 'darkBlue') {
        this.width = 100;
        this.height = 15;
        this.color = color;
        this.initX;
        this.initY;
        this.x;
        this.y;
    }
    setInitialPosition() {
        /** @type {CanvasRenderingContext2D}  */
        this.InitX = +canvas.width / 2;
        this.InitY = +canvas.height - (+canvas.height / 10) + 10 + 4; // los 10 del ball.radius  & los +4 por si le ponemos un stroke con 4 de lineWidth
        this.x = this.InitX;
        this.y = this.InitY;
    }
    draw() {
        /** @type {CanvasRenderingContext2D}  */
        let platform = new Path2D();
        platform.rect(this.x - (this.width / 2), this.y, this.width, this.height);
        ctx.fillStyle = 'white';
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
    ballIsFrontColliding(ballX, ballY, ballRadius) {
        let userX = this.x - this.width / 2;
        let sideX, sideY, collideType;
        if (ballY < (canvas.height / 4) * 3) return false;

        if (ballX < userX) sideX = userX;
        else if (ballX > userX + this.width) sideX = userX + this.width;
        if (ballY < this.y) sideY = this.y;
        else if (ballY > this.y + this.height) return false;

        const distanceX = ballX - sideX || 0;
        const distanceY = ballY - sideY || 0;
        collideType = (distanceX === 0) ? 'y' : 'x';
        const totalDistance = Math.sqrt((distanceX * distanceX) + (distanceY * distanceY));
        if (totalDistance <= ballRadius) {
            return true; // agregar el collideType al return como array
        }
        return false;
    }
}

class Game {

    constructor(gameLives = 3) {
        this.currentScore;
        this.gameLives = gameLives;
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
    clearBottomCanvas() {
        ctx.clearRect(0, canvas.height / 2, canvas.width, canvas.height / 2);
    }
    renderGame(){
        const drawingFunction = () => this.drawWaitingGame();
        this.drawInit();
        this.addEvents(window, 'mousemove', event => this.setUserPosition(event));
        this.addEvents(window, 'mousemove', drawingFunction);
        this.addEvents(canvas, 'click', () => this.drawStartedGame(), { once: true });
        this.addEvents(canvas, 'click', () => this.removeEvents(window, 'mousemove', drawingFunction), { once: true });
    }
    initGame(type = null) {
        const ball = this.initBall(-4, -4, 1);
        const user = this.initPlatform();
        this.ball = ball;
        this.userPlatform = user;
        if (type === "new") {
            const bricksNodes = this.initBricks();
            this.bricks = bricksNodes;
        }
    }
    renderNewGame() {
        this.addHighScoreOnNewGame();
        this.UIresetLifes();
        this.initGame('new');
        this.renderGame();
    }
    continueGame() {
        this.initGame();
        this.renderGame();
    }
    initBricks() {
        const [topLeft, topRight, bottomLeft, bottomRight ] = [[], [], [], []];
        const bricksNodes = {
            topLeftNode: topLeft,
            topRightNode: topRight,
            bottomLeftNode: bottomLeft,
            bottomRightNode: bottomRight,
        };
        this.createBricks(topLeft, topRight, bottomLeft, bottomRight);
        return bricksNodes;
    }
    createBricks(topLeft, topRight, bottomLeft, bottomRight){
        let bricksColors = [[64, 100, 50], [117, 100, 15], [298, 100, 50], [30, 100, 50], [0, 0, 99]]; // colors on HSL format
        let brickDurability = [3, 2, 2, 1, 4];
        for (let index = 1; index <= 8; index++) {
            for (let Yindex = 1; Yindex <= 5; Yindex++) {
                let x = 5;
                let y = 10;
                let mult = 60;
                let brick = new Brick(brickDurability[Yindex - 1], 50, 30, (x + (mult * index)), y + (mult * Yindex), bricksColors[Yindex - 1]);
                if (brick.x < canvas.width / 2) {
                    if (brick.y < canvas.height / 3.5) topLeft.push(brick);
                    else bottomLeft.push(brick);
                } else if (brick.x > canvas.width / 2) { // derecha
                    if (brick.y < canvas.height / 3.5) topRight.push(brick);
                    else bottomRight.push(brick);
                };
            };
        };
    }
    initBall(xSpeed, ySpeed, dmg) {
        const ball = new Ball(xSpeed, ySpeed, dmg);
        ball.setInitialPosition();
        return ball;
    }
    initPlatform() {
        const platformUser = new Player();
        platformUser.setInitialPosition();
        return platformUser;
    }
    setUserPosition(event) {
        this.userXposition = +event.clientX;
    }
    drawInit() {
        this.ball.draw();
        this.userPlatform.draw();
        Object.values(this.bricks).flat().forEach(brick => brick.draw());
    }
    drawWaitingGame() {
        this.clearBottomCanvas();
        let x = this.userXposition;
        let userX = this.drawWaitingUser(x);
        this.drawWaitingBall(userX);
        this.userPlatform.draw();
        this.ball.draw();
    }
    drawWaitingBall(x) {
        this.ball.moveOverPlatform(x);
    }
    drawWaitingUser(x) {
        return this.userPlatform.move(x);
    }
    drawStartedGame() {
        let closestNode;

        // clean & draw
        this.clearCanvas();
        this.drawStartedBall(this.ball);
        this.drawStartedUser(this.userPlatform);
        Object.values(this.bricks).flat().forEach(brick => brick.draw());

        if (Object.values(this.bricks).flat().length === 24 && !this.ball.isAlreadyFaster) this.ball.increaseSpeed();
        if (this.userPlatform.ballIsFrontColliding(...this.ball.getNextPosition(), this.ball.radius)) this.ball.changeYspeed();

        if (this.ball.y < canvas.height / 2) { // Si está en el lado de arriba, donde están los bloques 
            if (this.ball.x < canvas.width / 2) { // revisa la izquierda
                closestNode = (this.ball.y < canvas.height / 3.5)
                    ? "topLeftNode" : "bottomLeftNode";
            } else { // revisa la derecha
                closestNode = (this.ball.y < canvas.height / 3.5)
                    ? "topRightNode" : "bottomRightNode";
            }
            for (let index = 0; index < this.bricks[closestNode].length; index++) {
                let brick = this.bricks[closestNode][index];
                let collision = brick.ballIsColliding(...this.ball.getNextPosition(), this.ball.radius);
                if (collision[0]) {
                    if (!this.ball.isAlreadyColliding) {
                        if (collision[1] === 'x') this.ball.changeXspeed();
                        else this.ball.changeYspeed();
                    }
                    this.ball.isAlreadyColliding = true;
                    brick.reduceLife(this.ball.damage);
                    if (brick.durability === 0) {
                        let index = this.bricks[closestNode].indexOf(brick);
                        this.bricks[closestNode].splice(index, 1);
                        brick.delete();
                    } else {
                        brick.drawDamaged()
                    }
                }
            }
        }
        if (!this.ball.isDead(this.nextFrameID) && !this.isWin()) {
            this.nextFrameID = window.requestAnimationFrame(() => this.drawStartedGame());
        } else {
            window.cancelAnimationFrame(this.nextFrameID);
            this.removeLife();
            if (!this.isGameOver() && !this.isWin()) {
                window.setTimeout(() => {
                    this.clearCanvas();
                    this.continueGame();
                }, 500);
            } else {
                window.setTimeout(() => {
                    this.finishGame();
                }, 500);
            }
        }
    }
    finishGame() {
        this.updateScore();
        this.clearCanvas();
        this.renderNewGame();
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
        if (this.gameLives <= 0){
            this.gameLives = 3;
            return true;
        }
    }
    isWin() {
        return (Object.values(this.bricks).flat().length === 0);
    }
    removeLife() {
        this.gameLives -= 1;
        this.UIlifes(1);
    }
    updateScore(){
        const highestScore = this.getMaxScore();
        const currentScore = this.getCurrentScore();
        if (+currentScore > +highestScore){
            this.UIHighScore(currentScore);
        }
        this.addNewScore(currentScore);
        this.UICurrentScore(currentScore);
    }
    addNewScore(score) {
        let index = localStorage.length
        localStorage.setItem(`user${index}`, score);
    }
    getCurrentScore(){
        let bricksAlive = Object.values(this.bricks).flat().length;
        let score = (40 - bricksAlive) * 250;
        return score;
    }
    getMaxScore() {
        let score = 0;
        if (localStorage.length > 0) {
            const scores = Object.entries(localStorage).sort((a, b) => +b[1] - +a[1]);
            score = +scores[0][1];
        }
        return score;
    }
    addHighScoreOnNewGame(){
        let score = this.getMaxScore();
        this.UIHighScore(score);
    }
    UIHighScore(score){
        const UI = document.getElementById('high-score-points');
        UI.textContent = score;
    }
    UICurrentScore(score){
        const UI = document.getElementById('current-score-points');
        UI.textContent = score;
    }
    UIlifes(amount){
        const UI = document.getElementById('user-life-points');
        const oldValue = UI.textContent;
        UI.textContent = +oldValue - amount;
    }
    UIresetLifes(){
        const UI = document.getElementById('user-life-points');
        UI.textContent = 3;
    }
}

class Brick {
    constructor(durability = 1, width = 50, height = 20, x, y, colors) {
        this.durability = durability;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.colorH = colors[0];
        this.colorS = colors[1];
        this.colorL = colors[2];
    }
    draw() {
        let brick = new Path2D();
        brick.rect(this.x, this.y, this.width, this.height);
        /** @type {CanvasRenderingContext2D}  */
        let brickColor = `hsl(${this.colorH}, ${this.colorS}%, ${this.colorL}%)`;
        ctx.fillStyle = brickColor;
        ctx.shadowColor = 'black';
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 5;
        ctx.fill(brick);
        ctx.shadowColor = 'transparent';
    }
    drawDamaged() {
        this.colorL -= 15;
    }
    reduceLife(dmg) {
        this.durability -= dmg;
    }
    ballIsColliding(ballX, ballY, ballRadius) {
        let sideX, sideY, typeOfCollide;
        // revisamos si la bola está de lado izquierdo, derecho, arriba o abajo.
        if (ballX < this.x) sideX = this.x;
        else if (ballX > this.x + this.width) sideX = this.x + this.width;
        if (ballY < this.y) sideY = this.y;
        else if (ballY > this.y + this.height) sideY = this.y + this.height;

        const distanceX = ballX - sideX || 0;
        const distanceY = ballY - sideY || 0;
        typeOfCollide = (distanceX === 0) ? 'y' : 'x';
        const totalDistance = Math.sqrt((distanceX * distanceX) + (distanceY * distanceY));
        if (totalDistance <= ballRadius) {
            return [true, typeOfCollide];
        }
        return [false, typeOfCollide];
    }
    delete() {
        ctx.clearRect(this.x, this.y, this.width, this.height);
    }
}

let game = new Game(3);
game.renderNewGame();
