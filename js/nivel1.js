
class Game {
    constructor(playerId, gameContainerId, scoreDisplayId, startButtonId, restartButtonId) {
        this.player = document.getElementById(playerId);
        this.gameContainer = document.getElementById(gameContainerId);
        this.scoreDisplay = document.getElementById(scoreDisplayId);
        this.startButton = document.getElementById(startButtonId);
        this.restartButton = document.getElementById(restartButtonId);
        this.score = 0;
        this.gameInterval = null;
        this.enemies = [];
        this.enemySpeed = 10;
        this.isGamePaused = true;
        this.alpha = new datosAlservidor();
        this.init();
    }

    init() {
        document.addEventListener('keydown', this.movePlayer.bind(this));
        this.startButton.addEventListener('click', () => {
            if (this.isGamePaused) {
                this.startGame();
            } else {
                this.pauseGame();
            }
        });
        this.restartButton.addEventListener('click', this.restartGame.bind(this));
        window.onload = () => {
            this.pauseGame();
            this.alpha.obtenerPuntacionDelServidor((data) => {
                if (data.score !== undefined) {
                    this.score = data.score;
                    this.scoreDisplay.innerText = 'Atrapados: ' + this.score;
                } else {
                    console.error('Error al obtener la puntuación del servidor');
                }
            });
        };
    }

    movePlayer(event) {
        let top = this.player.offsetTop;
        if (event.key === 'ArrowUp' && top > 0) {
            this.player.style.top = top - 10 + 'px';
        }
        if (event.key === 'ArrowDown' && top < this.gameContainer.offsetHeight - this.player.offsetHeight) {
            this.player.style.top = top + 10 + 'px';
        }
    }

    createEnemy() {
        let enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.style.left = '0'; // Los enemigos aparecerán desde el lado izquierdo
        enemy.style.top = Math.random() * (this.gameContainer.offsetHeight - 30) + 'px';
        this.gameContainer.appendChild(enemy);
        this.enemies.push(enemy);
    }

    ensureEnemyCount() {
        while (this.enemies.length < this.initialEnemyCount) {
            this.createEnemy();
        }
    }

    moveEnemies() {
        this.enemies.forEach((enemy, index) => {
            if (enemy.style.display !== 'none') { // Mover solo los enemigos visibles
                let enemyLeft = enemy.offsetLeft;
                if (enemyLeft >= this.gameContainer.offsetWidth - enemy.offsetWidth) {
                    enemy.style.display = 'none';
                    setTimeout(() => {
                        this.repositionEnemy(enemy);
                    }, 1000); // Reaparece después de 1 segundo
                } else {
                    enemy.style.left = enemyLeft + this.enemySpeed + 'px'; // Mover hacia la derecha
                }
                this.checkCollision(this.player, enemy);
            }
        });
        this.ensureEnemyCount(); // Asegurarse de que siempre haya al menos `initialEnemyCount` enemigos
    }

    checkCollision(player, enemy) {
        if (this.isGamePaused) return;

        let playerRect = player.getBoundingClientRect();
        let enemyRect = enemy.getBoundingClientRect();

        if (playerRect.x < enemyRect.x + enemyRect.width &&
            playerRect.x + playerRect.width > enemyRect.x &&
            playerRect.y < enemyRect.y + enemyRect.height &&
            playerRect.y + playerRect.height > enemyRect.y) {
            this.score++;
            this.scoreDisplay.innerText = 'Atrapados: ' + this.score;
            if (this.score >= 10) {
                clearInterval(this.gameInterval);
                alert('Haz ganado, pasas al siguiente nivel');
                this.alpha.enviarNivelAlServidor('2');
                this.alpha.enviarPuntacionAlServidor('0');
                window.location.href = "nivel2.html";
            }
            enemy.style.display = 'none';
            setTimeout(() => {
                this.repositionEnemy(enemy);
            }, 1500); // Reaparece después de 1.5 segundos

            this.isGamePaused = true;
            setTimeout(() => {
                this.isGamePaused = false;
            }, 1500);
        }
    }

    repositionEnemy(enemy) {
        enemy.style.left = '0'; // Los enemigos aparecerán desde el lado izquierdo
        enemy.style.top = Math.random() * (this.gameContainer.offsetHeight - 30) + 'px';
        enemy.style.display = 'block';
    }

    startGame() {
        if (!this.isGamePaused) return;
        this.initialEnemyCount = getRandomInt(3, 5); // Número aleatorio de enemigos entre 3 y 5
        this.gameInterval = setInterval(this.moveEnemies.bind(this), 50);
        this.ensureEnemyCount(); // Crear los enemigos iniciales
        this.isGamePaused = false;
    }

    pauseGame() {
        clearInterval(this.gameInterval);
        this.isGamePaused = true;
    }

    restartGame() {
        this.alpha.enviarPuntacionAlServidor(String(this.score));
        this.alpha.enviarNivelAlServidor('1');
        clearInterval(this.gameInterval);
        this.enemies.forEach(enemy => enemy.remove());
        this.enemies = [];
        this.score = 0;
        this.player.style.top = '50%';
        this.isGamePaused = true;
        alert("Juego acabado, yendo a la pantalla de puntaje");
        window.location.href = "PantallaFin.html";
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; // El máximo es inclusivo y el mínimo es inclusivo
}

document.addEventListener('DOMContentLoaded', (event) => {
    const game = new Game('player', 'gameContainer', 'score', 'startButton', 'restartButton');
});