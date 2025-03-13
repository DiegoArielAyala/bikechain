//Backend para recibir el archivo metadata.json, subirlo  a IPFS y devolver la URL

import "dotenv/config";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import axios from "axios";
import path from "node:path";
import { fileURLToPath } from "node:url"; 
import FormData from "form-data";
import fs from "node:fs/promises";

// Configurar dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
app.use(cors()); //Permitir solicitudes desde React

// Configuracion de Multer para manejar archivos
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Ruta para subir archivos a IPFS
app.post("/upload-to-ipfs", upload.single("file"), async (req, res) => {
    try {
        const file = req.file;
        if(!file) {
            return res.status(400).json({ error: "No se proporciono ningun archivo."})
        }

        // Crear FormData para enviar a Pinata
        const formData = new FormData();
        // const blob = new Blob([file.buffer]);
        formData.append("file", file.buffer, file.originalname);

        // Configurar Headers con las claves de Pinata
        const headers = {
            "pinata_api_key": process.env.PINATA_API_KEY,
            "pinata_secret_api_key": process.env.PINATA_API_SECRET,
            ...formData.getHeaders(),
        }

        // Hacer la solicitud a Pinata
        const response = await axios.post(
            "https://api.pinata.cloud/pinning/pinFileToIPFS",
            formData,
            { headers }
        );

        const ipfsHash = response.data.IpfsHash;
        const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}?filename=${file.originalname}`;

        res.json({ ipfsUrl });
    } catch (error) {
        console.error("Error subiendo a IPFS: ", error);
        res.status(500).json({ error: "Error al subir el archivo a IPFS"});
    }
})

app.post("/save-metadata", upload.single("file"), async (req, res) => {
    try {
        const file = req.file;
        if(!file){
            return res.status(400).json({ error: "No se proporciono ningun archivo"});
        }

        const savePath = path.join(__dirname, "../frontend/public/metadata", file.originalname);

        try {
            await fs.access(savePath);
            return res.status(400).json({ error: "El archivo ya existe "})
        }catch(err){

        }

        // Asegurar que la carpeta metadata existe
        await fs.mkdir(path.dirname(savePath), { recursive: true });

        await fs.writeFile(savePath, file.buffer);
        console.log("Archivo guardado en: ", savePath);

        res.json({ message: "Archivo guardado exitosamente", path: `./metadata/${file.originalname}`});
        
        
    } catch (error) {
        console.error("Error al guardar el archivo: ", error);
        res.status(500).json({ error: "Error al guardar el archivo."});
    }
})

// Iniciar el servidor en el puerto 5001
app.listen(5001,() => {
    console.log("Servidor corriendo en http://localhost:5001");
})