class datosAlservidor {
    enviarNivelAlServidor(nivel) {
        $.post("PHP/updateLevel.php", { nivel: nivel }, function (data) {
        });
    }
    enviarPuntacionAlServidor(puntuacion) {
        $.post("PHP/updateScore.php", { puntuacion: puntuacion }, function (data) {
        });
    }
    obtenerPuntacionDelServidor(callback) {
        $.get("PHP/getScore.php", function (data) {
            callback(JSON.parse(data));
        });
    }
    obtenerUsuariosDelServidor(callback) {
        $.get("php/getUsuarios.php", function (data) {
            callback(JSON.parse(data));
        });
    }
}
