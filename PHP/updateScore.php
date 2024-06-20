<?php
include 'query.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST["puntuacion"])) {
        $puntuacion = $_POST["puntuacion"];
        echo $puntuacion;
        $query = new Query();
        $query->updateScore($puntuacion);
    } else {
        echo json_encode(array("error" => "No se proporcionó la puntuación en la solicitud POST."));
    }
}
?>
