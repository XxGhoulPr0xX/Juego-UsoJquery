<?php
session_start();
if (!isset($_SESSION["nivel"])) {
    header("Location: index.php");
    exit();
}
$nivel = $_SESSION["nivel"];
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Juego</title>
    <link rel="stylesheet" href="css/presentacion.css">
</head>

<body>
    <div class="main">
        <div class="left-container" id="leftContainer">
            <img id="leftImage" src="css/assets/pez2x.png" alt="Imagen Izquierda">
        </div>
        <div class="right-container" id="rightContainer">
            <img id="rightImage" src="css/assets/pex22.png" alt="Imagen Derecha">
        </div>
    </div>
    <script>
        class ImageSwitcher {
            constructor(leftContainerId, rightContainerId, leftImageId, rightImageId, nivel) {
                this.leftContainer = document.getElementById(leftContainerId);
                this.rightContainer = document.getElementById(rightContainerId);
                this.leftImage = document.getElementById(leftImageId);
                this.rightImage = document.getElementById(rightImageId);
                this.body = document.body;
                this.nivel = nivel;
                this.init();
            }

            init() {
                this.moveLeftContainer();
                this.leftContainer.addEventListener("transitionend", () => {
                    this.changeImages();
                });
            }

            moveLeftContainer() {
                this.leftContainer.style.transform = "translateX(100%)";
            }

            removeElements() {
                this.leftContainer.remove();
            }

            changeImages() {
                this.rightImage.src = "css/assets/lint.png";
                this.body.classList.add("flip");
                this.body.addEventListener("animationend", () => {
                    this.removeElements();
                    this.loadNextLevel();
                    this.body.classList.remove("flip");
                    this.rightContainer.classList = "left-container";
                }, {
                    once: true
                });
            }

            loadNextLevel() {
                switch (this.nivel) {
                    case 1:
                        window.location.href = "nivel1.html";
                        break;
                    case 2:
                        window.location.href = "nivel2.html";
                        break;
                    case 3:
                        window.location.href = "nivel3.html";
                        break;
                    case 4:
                        window.location.href = "nivel4.html";
                        break;
                    default:
                        window.location.href = "tablaPuntacion.html";
                }
            }
        }

        document.addEventListener("DOMContentLoaded", () => {
            const nivel = <?php echo $nivel; ?>;
            new ImageSwitcher("leftContainer", "rightContainer", "leftImage", "rightImage", nivel);
            console.log('Nivel:', nivel);
        });
    </script>
</body>

</html>
