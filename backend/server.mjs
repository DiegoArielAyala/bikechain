import "dotenv/config";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url"; 

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
        formData.append("file", file.buffer, "FIRST_ACTIVITY.json");

        // Configurar Headers con las claves de Pinata
        const headers = {
            "pinata_api_key": process.env.PINATA_API_KEY,
            "pinata_secret_key": process.env.PINATA_API_SECRET
        }

        // Hacer la solicitud a Pinata
        const response = await axios.post(
            "https://api.pinata.cloud/pinning/pinFileToIPFS",
            formData,
            { headers }
        );

        const ipfsHash = response.data.IpfsHash;
        const ipfsUrl = `https://ipfs.ip/ipfs/${ipfsHash}`;

        res.json({ ipfsUrl })
    } catch (error) {
        console.error("Error subiendo a IPFS: ", error);
        res.status(500).json({ error: "Error al suir el archivo a IPFS"});
    }
})

// Iniciar el servidor en el puerto 5001
app.listen(5001,() => {
    console.log("Servidor corriendo en http://localhost:5001");
})