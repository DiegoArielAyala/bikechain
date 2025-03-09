const { exec } = require("child_process");
const express = require("express");

const app = express();
const PORT = 5000; 

app.get("/start-metadata", (req, res) => {
    const command = "/usr/bin/uvicorn ./metadata.metadata_template:app --reload --port 8001"; 

    exec(command, { shell: true }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error al iniciar FastAPI: ${error.message}`);
            return res.status(500).json({ error: "Error al iniciar FastAPI" });
        }
        if (stderr) {
            console.error(`Error en ejecución: ${stderr}`);
        }
        console.log(`FastAPI iniciado:\n${stdout}`);
        res.json({ message: "FastAPI iniciado" });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor intermedio escuchando en http://localhost:${PORT}`);
    console.log(`http://localhost:${PORT}/start-metadata`);
});