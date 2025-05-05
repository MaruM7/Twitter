const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

// Ruta que devuelve el nombre de un usuario y su contraseña
app.get("/usuarios", (req ,res) => {
    console.log("enviando respuesta");
    res.json({
        nombre: "Usuario1",
        contraseña: "Pass123"
    });
});

// Servidor escuchando en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
