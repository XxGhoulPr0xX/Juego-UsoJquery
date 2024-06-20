class Nivel2 {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.score = 0;
        this.gameOver = false;
        this.gameRunning = false;
        this.sharkInterval = null;
        this.fish = {
            x: 50,
            y: 250,
            width: 100,
            height: 100,
            speed: 5,
            image: new Image(),
        };
        this.fish.image.src = 'css/assets/lint.png';
        this.sharks = [];
        this.bullets = [];
        this.beta = new datosAlservidor();
        this.init();
    }

    init() {
        this.moveFish();
        this.cargarPuntaje(); // Carga el puntaje al iniciar el juego
        document.getElementById('start-button').addEventListener('click', () => {
            if (this.gameOver || !this.gameRunning) {
                this.resetGame();
            }
            this.gameRunning = true;
            this.gameLoop();
        });

        document.getElementById('end-button').addEventListener('click', () => {
            this.partidaTerminada();
        });
    }

    cargarPuntaje(){
        this.beta.obtenerPuntacionDelServidor((data) => {
            if (data.score !== undefined) {
                this.score = data.score;
                document.getElementById('score').textContent = this.score;
            } else {
                console.error('Error al obtener la puntuación del servidor');
            }
        });
    }

    createShark() {
        if (this.gameRunning) {
            const shark = {
                x: this.canvas.width,
                y: Math.random() * (this.canvas.height - 100),
                width: 200,
                height: 100,
                speed: 1 + Math.random(),
                image: new Image(),
                hits: 0,
            };
            shark.image.src = 'css/assets/Tiburon.png';
            this.sharks.push(shark);
        }
    }

    drawFish() {
        this.ctx.drawImage(this.fish.image, this.fish.x, this.fish.y, this.fish.width, this.fish.height);
    }

    drawSharks() {
        this.sharks.forEach(shark => {
            this.ctx.drawImage(shark.image, shark.x, shark.y, shark.width, shark.height);
        });
    }

    drawBullets() {
        this.bullets.forEach(bullet => {
            this.ctx.fillStyle = 'yellow';
            this.ctx.beginPath();
            this.ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    moveFish() {
        document.addEventListener('keydown', event => {
            if (!this.gameRunning) return;
            if (event.key === 'ArrowUp' && this.fish.y > 0) this.fish.y -= this.fish.speed;
            if (event.key === 'ArrowDown' && this.fish.y < this.canvas.height - this.fish.height) this.fish.y += this.fish.speed;
            if (event.key === 'ArrowLeft' && this.fish.x > 0) this.fish.x -= this.fish.speed;
            if (event.key === 'ArrowRight' && this.fish.x < this.canvas.width - this.fish.width) this.fish.x += this.fish.speed;
            if (event.key === 'h') this.shootBullet();
        });
    }

    shootBullet() {
        const bullet = {
            x: this.fish.x + this.fish.width,
            y: this.fish.y + this.fish.height / 2,
            radius: 10,
            speed: 10,
        };
        this.bullets.push(bullet);
    }

    moveSharks() {
        this.sharks.forEach(shark => {
            shark.x -= shark.speed;
        });
    }

    moveBullets() {
        this.bullets.forEach(bullet => {
            bullet.x += bullet.speed;
        });
    }

    circleRectCollision(circle, rect) {
        const circleDistanceX = Math.abs(circle.x - rect.x - rect.width / 2);
        const circleDistanceY = Math.abs(circle.y - rect.y - rect.height / 2);

        if (circleDistanceX > (rect.width / 2 + circle.radius)) {
            return false;
        }
        if (circleDistanceY > (rect.height / 2 + circle.radius)) {
            return false;
        }

        if (circleDistanceX <= (rect.width / 2)) {
            return true;
        }
        if (circleDistanceY <= (rect.height / 2)) {
            return true;
        }

        const cornerDistance_sq = Math.pow(circleDistanceX - rect.width / 2, 2) +
            Math.pow(circleDistanceY - rect.height / 2, 2);

        return (cornerDistance_sq <= Math.pow(circle.radius, 2));
    }

    checkCollisions() {
        this.sharks.forEach((shark, sIndex) => {
            this.bullets.forEach((bullet, bIndex) => {
                if (this.circleRectCollision(bullet, shark)) {
                    this.bullets.splice(bIndex, 1);
                    shark.hits += 1;
                    if (shark.hits >= 10) {
                        this.sharks.splice(sIndex, 1);
                        this.score++;
                        if (this.score >= 10) {
                            this.partidaGanada();
                        }
                    }
                }
            });
            if (
                this.fish.x < shark.x + shark.width &&
                this.fish.x + this.fish.width > shark.x &&
                this.fish.y < shark.y + shark.height &&
                this.fish.y + this.fish.height > shark.y
            ) {
                this.partidaPerdida();
            }
        });
    }

    partidaTerminada() {
        this.gameRunning = false;
        this.beta.enviarPuntacionAlServidor(this.score);
        this.beta.enviarNivelAlServidor('2');
        alert("Juego acabado, yendo a la pantalla de puntaje");
        window.location.href = "PantallaFin.html";
    }

    partidaGanada() {
        this.gameRunning = false;
        this.beta.enviarNivelAlServidor('3');
        this.beta.enviarPuntacionAlServidor('0');
        alert('¡Has ganado el juego!');
        window.location.href = "nivel3.html";
    }

    partidaPerdida() {
        this.gameRunning = false;
        this.gameOver = true;
        clearInterval(this.sharkInterval);
        this.score = 0;
        document.getElementById('score').textContent = 0;
        alert('Juego Terminado');
    }

    updateScore() {
        document.getElementById('score').textContent = this.score;
    }

    resetGame() {
        this.gameOver = false;
        this.fish.x = 50;
        this.fish.y = 250;
        this.sharks.length = 0;
        this.bullets.length = 0;
        this.updateScore();
        clearInterval(this.sharkInterval);
        this.sharkInterval = setInterval(() => this.createShark(), 2000);
    }

    gameLoop() {
        if (!this.gameRunning) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawFish();
        this.drawSharks();
        this.drawBullets();
        this.moveSharks();
        this.moveBullets();
        this.checkCollisions();
        this.updateScore();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Inicializa el juego
document.addEventListener("DOMContentLoaded", function () {
    const nivel2 = new Nivel2();
});
