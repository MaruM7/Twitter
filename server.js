const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/usuarios", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*"); // Permitir cualquier origen
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");

    console.log("Enviando respuesta");
    res.json({
        nombre: "Usuario1",
        contraseña: "Pass123"
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
