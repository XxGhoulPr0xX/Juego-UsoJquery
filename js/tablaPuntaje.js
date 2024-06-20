class tablaPuntaje {
    constructor() {
        this.alpha = new datosAlservidor();
        this.getUsuarios();
    }

    getUsuarios() {
        this.alpha.obtenerUsuariosDelServidor((usuarios) => {
            usuarios.sort((a, b) => {
                if (b.level !== a.level) {
                    return b.level - a.level;
                } else {
                    return b.score - a.score;
                }
            });
            usuarios.forEach(usuario => {
                tablaPuntaje.addRow(usuario);
            });
        });
    }

    static addRow(usuario) {
        const table = document.querySelector("table tbody"); // Seleccionar el cuerpo de la tabla
        const row = document.createElement("tr");

        const nombreCell = document.createElement("td");
        nombreCell.innerText = usuario.name;
        row.appendChild(nombreCell);

        const puntajeCell = document.createElement("td");
        puntajeCell.innerText = usuario.score;
        row.appendChild(puntajeCell);

        const nivelCell = document.createElement("td");
        nivelCell.innerText = usuario.level;
        row.appendChild(nivelCell);

        table.appendChild(row);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    new tablaPuntaje();
});
