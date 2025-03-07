const { message } = require("antd");
const {exec} = require("child_process");
const express = require("express");
const { stderr } = require("process");

const app = express()
const PORT = 5000

app.get("/start-metadata", (req, res) => {
    const command = "uvicorn metadata/metadata_template:app --reload";

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error("Error: ", error.message);
            return res.status(500).json({error: "Error al inciar FastApi"});
        }
        if(stderr) {
            console.error("Error en ejecucion: ", stderr);
            return;
        }
        console.log("FastApi iniciado: ", stdout);
        res.json({message: "FastApi iniciado"});
    });
});

app.listen(PORT,() => {
    console.log(`Servidor intermedio escuchando en http://localhost:${PORT}`)
});