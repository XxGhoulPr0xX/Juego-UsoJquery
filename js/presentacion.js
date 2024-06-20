class ImageSwitcher {
    constructor(leftContainerId, rightContainerId, leftImageId, rightImageId) {
        this.leftContainer = document.getElementById(leftContainerId);
        this.rightContainer = document.getElementById(rightContainerId);
        this.leftImage = document.getElementById(leftImageId);
        this.rightImage = document.getElementById(rightImageId);
        this.body = document.body;
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
                window.location.href = "nivel4.html";
                break;
            case 3:
                window.location.href = "nivel3.html";
                break;
            case 4:
                window.location.href = "nivel4.html";
                break;
            default:
                window.location.href = "PantallaFin.html";
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new ImageSwitcher("leftContainer", "rightContainer", "leftImage", "rightImage");
});
