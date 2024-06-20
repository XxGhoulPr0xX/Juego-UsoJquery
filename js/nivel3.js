class Jugador {
    constructor() {
        this.width = 200;
        this.height = 200;
        this.speed = 20;
        this.x = (canvas.width - this.width) / 2;
        this.y = canvas.height - this.height;
        this.image = new Image();
        this.image.src = 'css/assets/lint.png';
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    move(event) {
        if (event.key === 'ArrowLeft' && this.x > 0) this.x -= this.speed;
        if (event.key === 'ArrowRight' && this.x < canvas.width - this.width) this.x += this.speed;
    }
}

class Enemigo {
    constructor() {
        this.width = 190;
        this.height = 190;
        this.speed = 2;
        this.direction = 1;
        this.x = (canvas.width - this.width) / 2;
        this.y = 0;
        this.image = new Image();
        this.image.src = 'css/assets/Submarino.png';
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    move() {
        if (this.x + this.width >= canvas.width || this.x <= 0) {
            this.direction *= -1;
        }
        this.x += this.speed * this.direction;
    }
}

class Proyectil {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 15;
        this.speed = 3;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'yellow';
        ctx.fill();
        ctx.closePath();
    }

    move() {
        this.y += this.speed;
    }
}

class Juego {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.score = 0;
        this.level = 1;
        this.gameRunning = false;
        this.fish = new Jugador();
        this.submarine = new Enemigo();
        this.bullets = [];
        this.charlie = new datosAlservidor();
        this.init();
    }

    init() {
        this.cargarPuntaje(); // Carga el puntaje al iniciar el juego
        document.addEventListener('keydown', (event) => this.fish.move(event));
        document.getElementById('start-button').addEventListener('click', () => this.start());
        document.getElementById('end-button').addEventListener('click', () => this.end());
        this.updateScore();
    }

    cargarPuntaje() {
        this.charlie.obtenerPuntacionDelServidor((data) => {
            if (data.score !== undefined) {
                this.score = data.score;
                document.getElementById('score').textContent = `Score: ${this.score}`;
            } else {
                console.error('Error al obtener la puntuación del servidor');
            }
        });
    }
    partidaTerminada() {
        this.gameRunning = false;
        this.charlie.enviarPuntacionAlServidor(this.score);
        this.charlie.enviarNivelAlServidor('3');
        alert("Juego acabado, yendo a la pantalla de puntaje");
        window.location.href = "PantallaFin.html";
    }
    partidaGanada() {
        this.gameRunning = false;
        this.charlie.enviarNivelAlServidor('4');
        this.charlie.enviarPuntacionAlServidor('0');
        alert('¡Has ganado el juego!');
        window.location.href = "nivel4.html";
    }
    partidaPerdida() {
        this.gameRunning = false;
        this.charlie.enviarPuntacionAlServidor('0');
        this.charlie.enviarNivelAlServidor('3');
        this.score=0;
        document.getElementById('score').textContent = `Score: ${this.score}`;
        alert('Juego Terminado');
    }

    start() {
        if (!this.gameRunning) {
            this.resetGame();
            this.gameRunning = true;
            setInterval(() => {
                if (this.gameRunning) {
                    this.createBullet();
                }
            }, 1000);
            this.gameLoop();
        }
    }

    end() {
        this.partidaTerminada()
    }

    resetGame() {
        this.gameRunning = false;
        this.fish.x = (canvas.width - this.fish.width) / 2;
        this.fish.y = canvas.height - this.fish.height;
        this.submarine.x = (canvas.width - this.submarine.width) / 2;
        this.submarine.direction = 1;
        this.submarine.speed = 2;
        this.bullets = [];
        this.updateScore();
    }

    createBullet() {
        const bullet = new Proyectil(this.submarine.x + this.submarine.width / 2, this.submarine.y + this.submarine.height);
        this.bullets.push(bullet);
    }

    draw() {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.fish.draw(this.ctx);
        this.submarine.draw(this.ctx);
        this.bullets.forEach(bullet => bullet.draw(this.ctx));
    }

    move() {
        this.submarine.move();
        this.bullets.forEach(bullet => bullet.move());
    }

    checkBulletPassed() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            if (this.bullets[i].y > this.canvas.height) {
                this.score++;
                if (this.score === 10) {
                    this.submarine.speed = 4;
                    this.bullets.forEach(bullet => bullet.speed = 6);
                    this.partidaGanada();
                }
                this.updateScore();
                this.bullets.splice(i, 1);
            }
        }
    }

    circleRectCollision(circle, rect) {
        const distX = Math.abs(circle.x - rect.x - rect.width / 2);
        const distY = Math.abs(circle.y - rect.y - rect.height / 2);

        if (distX > (rect.width / 2 + circle.radius) || distY > (rect.height / 2 + circle.radius)) {
            return false;
        }

        if (distX <= (rect.width / 2) || distY <= (rect.height / 2)) {
            return true;
        }

        const dx = distX - rect.width / 2;
        const dy = distY - rect.height / 2;
        return (dx * dx + dy * dy <= (circle.radius * circle.radius));
    }

    checkCollisions() {
        this.bullets.forEach((bullet, bIndex) => {
            if (this.circleRectCollision(bullet, this.fish)) {
                this.bullets.splice(bIndex, 1);
                this.partidaPerdida();
            }
        });
    }

    removeOffscreenBullets() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            if (this.bullets[i].y > this.canvas.height) {
                this.bullets.splice(i, 1);
            }
        }
    }

    updateScore() {
        document.getElementById('score').textContent = `Score: ${this.score}`;
    }

    gameLoop() {
        if (!this.gameRunning) return;
        this.draw();
        this.move();
        this.checkBulletPassed();
        this.checkCollisions();
        this.removeOffscreenBullets();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Inicialización del juego
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

const game = new Juego(canvas, ctx);
