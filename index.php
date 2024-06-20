<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Login</title>
    <link rel="stylesheet" href=css/Login.css />
</head>

<body>
    <div class="image-container">
        <img src="css/assets/fondodellogin.jpg" alt="Background Image">
    </div>
    <div class="login-box">
        <h1>Iniciar sesión</h1>
        <img class="avatar" src="css/assets/user.jpeg" width="1" />
        <form id="loginForm" action="index.php" method="post">
            <label for="username"><i class='bx bxs-user-circle'></i> Usuario</label>
            <input type="text" id="user" placeholder="Usuario" name="user">
            <label for="password">Contraseña</label>
            <input type="password" id="password" placeholder="Contraseña" name="password">
            <input type="submit" id="ingresar" name="accion" value="Ingresar">
            <input type="submit" id="registrarme" name="accion" value="Registrarse">
        </form>
    </div>
    <script src="js/login.js"></script>
    <?php
    session_start();
    include 'php/conexion.php';

    $db = new Database("localhost", "sa", "123456789", "juego");
    $conn = $db->conectar();

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        if (isset($_POST["accion"]) && $_POST["accion"] == "Ingresar") {
            $user = $_POST['user'];
            $password = $_POST['password'];
            $sql = "SELECT name, password, level FROM usuario WHERE name = ? AND password = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ss", $user, $password);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();
                $nivel = $row["level"];
                $_SESSION["nivel"] = $nivel;
                $_SESSION["usuario"] = $user;
                $_SESSION["contraseña"] = $password; // Guardar también la contraseña en la sesión
                header("Location: presentacion.php");
                exit();
            } else {
                echo "<p id='mensaje-error'>Usuario o contraseña incorrectos.</p>";
            }
            $stmt->close();
        } elseif (isset($_POST["accion"]) && $_POST["accion"] == "Registrarse") {
            header("Location: sign_up.php");
            exit();
        }
    }
    $conn->close();
    ?>
    </div>
</body>

</html>