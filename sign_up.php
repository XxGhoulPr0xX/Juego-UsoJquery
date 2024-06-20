<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Sign up</title>
    <link rel="stylesheet" href="css/Login.css">
</head>

<body>
    <div class="image-container">
        <img src="css/assets/fondodellogin.jpg" alt="Background Image">
    </div>
    <div class="login-box">
        <h1>Registrarse</h1>
        <img class="avatar" src="css/assets/user.jpeg" width="1"/>
        <form id="loginForm" action="sign_up.php" method="post">
            <label for="username"><i class='bx bxs-user-circle'></i> Usuario</label>
            <input type="text" id="names" placeholder="Usuario" name="names" required>
            <label for="password">Contraseña</label>
            <input type="password" id="passwords" placeholder="Contraseña" name="passwords" required>
            <input type="submit" id="registrarse" name="accion" value="Registrarse">
        </form>
    </div>
    <?php
    include 'php/conexion.php';
    $db = new Database("localhost", "sa", "123456789", "juego");
    $conn = $db->conectar();
    if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["accion"]) && $_POST["accion"] == "Registrarse") {
        $name = $_POST['names'];
        $password = $_POST['passwords'];
        $level = 1;
        $puntuacion = 0;
        
        $sql = "INSERT INTO usuario (name, password, level, score) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssii", $name, $password, $level, $puntuacion);
        $stmt->execute();
        $stmt->close();
        $conn->close();
        
        header("Location: index.php");
        exit();
    }
    ?>
</body>

</html>
