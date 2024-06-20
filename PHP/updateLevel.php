<?php
include 'query.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST["nivel"])) {
        $nivel = $_POST["nivel"];
        $query = new Query();
        $query->updateLevel($nivel);
    } else {
        echo json_encode(array("error" => "No se proporcionó el nivel en la solicitud POST."));
    }
}
?>
