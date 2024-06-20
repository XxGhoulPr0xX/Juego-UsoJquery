<?php
include 'conexion.php';

class Query
{
    private $db;

    public function __construct()
    {
        $this->db = new Database("localhost", "sa", "123456789", "juego");
    }

    public function getScore()
    {
        $conn = $this->db->conectar();
        session_start();

        if (isset($_SESSION["usuario"]) && isset($_SESSION["contraseña"])) {
            $usuario = $_SESSION["usuario"];
            $password = $_SESSION["contraseña"];

            $sql = "SELECT score FROM usuario WHERE name = ? AND password = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ss", $usuario, $password);
            $stmt->execute();
            $stmt->bind_result($score);
            $stmt->fetch();
            $stmt->close();

            echo json_encode(array("score" => $score));
        } else {
            echo json_encode(array("error" => "No user session"));
        }
    }

    public function updateScore($puntuacion)
    {
        $conn = $this->db->conectar();
        session_start();

        if (isset($_SESSION["usuario"]) && isset($_SESSION["contraseña"])) {
            $usuario = $_SESSION["usuario"];
            $password = $_SESSION["contraseña"];

            try {
                $sql = "UPDATE usuario SET score = ? WHERE name = ? AND password = ?";
                $stmt = $conn->prepare($sql);
                if (!$stmt) {
                    throw new Exception("Error en la preparación de la consulta.");
                }
                $stmt->bind_param("iss", $puntuacion, $usuario, $password);
                if ($stmt->execute()) {
                    echo json_encode(array("success" => true));
                } else {
                    echo json_encode(array("error" => "Error al actualizar la puntuación."));
                }
                $stmt->close();
            } catch (Exception $e) {
                echo json_encode(array("error" => $e->getMessage()));
            }
        } else {
            echo json_encode(array("error" => "No user session"));
        }
    }

    public function updateLevel($nivel)
    {
        $conn = $this->db->conectar();
        session_start();

        if (isset($_SESSION["usuario"]) && isset($_SESSION["contraseña"])) {
            $usuario = $_SESSION["usuario"];
            $password = $_SESSION["contraseña"];

            try {
                $sql = "UPDATE usuario SET level = ? WHERE name = ? AND password = ?";
                $stmt = $conn->prepare($sql);
                if (!$stmt) {
                    throw new Exception("Error en la preparación de la consulta.");
                }
                $stmt->bind_param("iss", $nivel, $usuario, $password);
                if ($stmt->execute()) {
                    echo json_encode(array("success" => true));
                } else {
                    echo json_encode(array("error" => "Error al actualizar el nivel."));
                }
                $stmt->close();
            } catch (Exception $e) {
                echo json_encode(array("error" => $e->getMessage()));
            }
        } else {
            echo json_encode(array("error" => "No user session"));
        }
    }
    public function getUsuarios()
    {
        $conn = $this->db->conectar();
        try {
            $sql = "SELECT name, score, level FROM usuario";
            $result = $conn->query($sql);
            $usuarios = array();
    
            while ($row = $result->fetch_assoc()) {
                $usuarios[] = $row;
            }
            echo json_encode($usuarios);
        } catch (Exception $e) {
            echo json_encode(array("error" => $e->getMessage()));
        }
    }
}
