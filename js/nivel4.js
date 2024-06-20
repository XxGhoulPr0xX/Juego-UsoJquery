class Nivel4 {
    constructor() {
        this.cantidadMedusas = 0;
        this.medusasEsquivadas = 0;
        this.intervaloGeneracion = null;
        this.intervaloMovimientoPez = null;
        this.intervaloColision = null;
        this.contadorElemento = document.getElementById('contadorEsquivadas');
        this.delta = new datosAlservidor();
    }

    init() {
        this.cargarPuntuacionInicial();
        this.setupEventListeners();
    }

    cargarPuntuacionInicial() {
        this.delta.obtenerPuntacionDelServidor((data) => {
            if (data && data.score !== undefined) {
                this.medusasEsquivadas = data.score;
            } else {
                this.medusasEsquivadas = 0; // Valor por defecto
            }
            this.contadorElemento.textContent = ` ${this.medusasEsquivadas}`;
        });
    }

    verificarColision() {
        const pescado = document.getElementById('pescado');
        const medusas = document.querySelectorAll('.medusas');
        medusas.forEach(medusa => {
            const rectMedusa = medusa.getBoundingClientRect();
            const rectPescado = pescado.getBoundingClientRect();
            const hitboxPrimario = {
                x: rectMedusa.left + rectMedusa.width * 0.25,
                y: rectMedusa.top + rectMedusa.height * 0.25,
                width: rectMedusa.width * 0.5,
                height: rectMedusa.height * 0.5
            };
            const hitboxSecundario = {
                x: rectMedusa.left,
                y: rectMedusa.top,
                width: rectMedusa.width,
                height: rectMedusa.height
            };
            if (rectPescado.left < hitboxPrimario.x + hitboxPrimario.width &&
                rectPescado.left + rectPescado.width > hitboxPrimario.x &&
                rectPescado.top < hitboxPrimario.y + hitboxPrimario.height &&
                rectPescado.top + rectPescado.height > hitboxPrimario.y) {
                this.partidaPerdida();
            } else if (rectPescado.left < hitboxSecundario.x + hitboxSecundario.width &&
                rectPescado.left + rectPescado.width > hitboxSecundario.x &&
                rectPescado.top < hitboxSecundario.y + hitboxSecundario.height &&
                rectPescado.top + rectPescado.height > hitboxSecundario.y) {
                if (!medusa.tocadaSecundaria) {
                    medusa.tocadaSecundaria = true;
                    this.aumentarMedusasEsquivadas();
                }
                return;
            }
        });
    }

    aumentarMedusasEsquivadas() {
        this.medusasEsquivadas++;
        this.contadorElemento.textContent = ` ${this.medusasEsquivadas}`;
        if (this.medusasEsquivadas >= 15) {
            this.partidaGanada();
        }
    }

    partidaPerdida() {
        alert('¡Perdiste! La medusa te ha atrapado.');
        this.delta.enviarPuntacionAlServidor('0');
        clearInterval(this.intervaloGeneracion);
        clearInterval(this.intervaloMovimientoPez);
        clearInterval(this.intervaloColision);
        this.eliminarMedusas();
        return;
    }

    partidaGanada() {
        clearInterval(this.intervaloGeneracion);
        clearInterval(this.intervaloMovimientoPez);
        alert("¡Ganaste!");
        this.delta.enviarPuntacionAlServidor(this.medusasEsquivadas);
        this.delta.enviarNivelAlServidor('5');
        this.detenerTodo();
        this.eliminarMedusas();
    }

    obtenerDimensionesPecera() {
        const pecera = document.querySelector(".pecera");
        return pecera.getBoundingClientRect();
    }

    crearMedusa() {
        const dimensionesPecera = this.obtenerDimensionesPecera();
        if (this.cantidadMedusas <= 5) {
            const medusa = document.createElement("img");
            medusa.src = "css/assets/meduza.png";
            medusa.classList.add("medusas");

            const posX = Math.random() * (dimensionesPecera.width - 90);
            medusa.style.left = posX + "px";
            medusa.style.top = "0px";

            let tamano = 90;
            medusa.style.width = tamano + "px";
            medusa.style.height = tamano + "px";
            const pecera = document.querySelector(".pecera");
            pecera.appendChild(medusa);
            this.cantidadMedusas++;
            const intervalo = setInterval(() => {
                const posY = parseInt(medusa.style.top);
                if (posY < dimensionesPecera.height) {
                    medusa.style.top = (posY + 4) + "px";
                } else {
                    clearInterval(intervalo);
                    medusa.remove(); // Eliminar la medusa del DOM
                    this.cantidadMedusas--;
                }
                tamano += Math.sin(new Date().getTime() / 300) * 2;
                medusa.style.width = tamano + "px";
                medusa.style.height = tamano + "px";
            }, 35);
        }
    }

    generarMedusasAutomaticamente() {
        this.intervaloGeneracion = setInterval(() => {
            this.crearMedusa();
        }, 1000);
    }

    moverPez() {
        const image = document.getElementById('pescado');
        const container = document.querySelector('.pecera');
        const containerRect = container.getBoundingClientRect();
        let posX = containerRect.width / 2 - image.offsetWidth / 2;
        let posY = containerRect.height - image.offsetHeight; // Posición inferior del contenedor
        const moveStep = 50;
        let scaleX = 1;

        const moveImage = (event) => {
            switch (event.key) {
                case 'ArrowLeft':
                case 'a':
                    if (posX - moveStep >= 0) {
                        posX -= moveStep;
                        scaleX = 1;
                    }
                    break;
                case 'ArrowRight':
                case 'd':
                    if (posX + moveStep + image.offsetWidth <= containerRect.width) {
                        posX += moveStep;
                        scaleX = -1;
                    }
                    break;
            }
            image.style.left = posX + "px";
            image.style.top = posY + "px"; // Establecer la posición y
            image.style.transform = `scaleX(${scaleX})`;
        };

        window.addEventListener('keydown', moveImage);
    }

    iniciarTodo() {
        this.generarMedusasAutomaticamente();
        this.moverPez();
        this.intervaloColision = setInterval(() => {
            this.verificarColision();
        }, 1);
    }

    setupEventListeners() {
        document.getElementById('boton_rojo').addEventListener('click', () => {
            this.detenerTodo();
        });
        document.getElementById('boton_verde').addEventListener('click', () => {
            this.iniciarTodo();
        });
    }

    detenerTodo() {
        console.log(this.medusasEsquivadas);
        this.delta.enviarNivelAlServidor('4');
        this.delta.enviarPuntacionAlServidor(this.medusasEsquivadas);
        alert("Juego acabado, yendo a la pantalla de puntaje");
        clearInterval(this.intervaloGeneracion);
        clearInterval(this.intervaloMovimientoPez);
        clearInterval(this.intervaloColision);
        this.eliminarMedusas();
        window.location.href = "PantallaFin.html";
    }

    eliminarMedusas() {
        const medusas = document.querySelectorAll('.medusas');
        medusas.forEach(medusa => {
            medusa.remove();
        });
        this.cantidadMedusas = 0;
        this.medusasEsquivadas = 0;
        this.contadorElemento.textContent = `0`;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const nivel4 = new Nivel4();
    nivel4.init();
});
